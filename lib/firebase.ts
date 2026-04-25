import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Lazy singletons — prevents Firebase from initializing during SSR prerendering
let _app: FirebaseApp | null = null
let _db: Firestore | null = null
let _auth: Auth | null = null
let _googleProvider: GoogleAuthProvider | null = null
let _storage: FirebaseStorage | null = null

function getApp(): FirebaseApp {
  if (_app) return _app
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return _app
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getApp())
  return _db
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(getApp())
  return _auth
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) _googleProvider = new GoogleAuthProvider()
  return _googleProvider
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getApp())
  return _storage
}
