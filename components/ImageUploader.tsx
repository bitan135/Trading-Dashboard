'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  label: string
  value: string | undefined
  onChange: (url: string) => void
  disabled?: boolean
  dateString: string
  uid: string
}

export default function ImageUploader({ label, value, onChange, disabled, dateString, uid }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Dynamic import
      const { getStorageInstance } = await import('@/lib/firebase')
      const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')

      const storage = getStorageInstance()
      const ext = file.name.split('.').pop()
      const filename = `${label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.${ext}`
      const storageRef = ref(storage, `users/${uid}/sessions/${dateString}/${filename}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        null,
        (err) => {
          console.error(err)
          setError('Failed to upload image')
          setUploading(false)
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          onChange(url)
          setUploading(false)
        }
      )
    } catch (err) {
      console.error(err)
      setError('Upload error')
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-[#888] uppercase tracking-widest">{label}</label>

      <div className="relative group rounded-sm border border-[rgba(0,255,136,0.15)] overflow-hidden bg-[#0a0a0a]">
        {value ? (
          <div className="relative aspect-video w-full bg-[#111] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="object-contain w-full h-full" />
            {!disabled && (
              <div className="absolute inset-0 bg-[#000000a0] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onChange('')}
                  className="bg-[#ff4444] text-white p-2 rounded-full hover:scale-110 transition-transform"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full aspect-video flex flex-col items-center justify-center gap-2 hover:bg-[#141414] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#555] hover:text-[#00ff88]"
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin text-[#00ff88]" />
                <span className="text-[10px] uppercase tracking-wider text-[#00ff88]">Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={24} className="opacity-50" />
                <span className="text-[10px] uppercase tracking-wider opacity-50">Click to upload image</span>
              </>
            )}
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-[#ff4444]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
