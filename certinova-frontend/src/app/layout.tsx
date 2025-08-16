import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { EventProvider } from "@/context/EventContext"
import { CertificateProvider } from "@/context/CertificateContext"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CertiNova - Bulk Certificate Generator",
  description: "Generate bulk certificates for your events and organizations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EventProvider>
            <CertificateProvider>
              {children}
              <Toaster position="bottom-right" />
            </CertificateProvider>
          </EventProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
