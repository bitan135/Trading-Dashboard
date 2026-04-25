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
