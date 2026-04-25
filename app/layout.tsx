import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "S.C.A.L.P. Journal | Trading Session Checklist",
  description:
    "Personal trading journal and session checklist for the S.C.A.L.P. framework by WWA Trading. Track pre-session analysis, London & NY sessions, and performance stats.",
  keywords: ["trading journal", "SCALP framework", "forex", "GBPUSD", "EURUSD", "WWA Trading"],
  metadataBase: new URL('https://trading-dashboard-eta-ten.vercel.app'),
  openGraph: {
    title: "S.C.A.L.P. Journal",
    description: "Personal trading journal and session checklist for the S.C.A.L.P. framework.",
    url: 'https://trading-dashboard-eta-ten.vercel.app',
    siteName: 'S.C.A.L.P. Journal',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'S.C.A.L.P. Journal Preview'
    }],
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} dark`}>
      <body
        className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] antialiased"
        style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
