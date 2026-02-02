import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vibecode Next Template',
  description: 'AI-safe Next.js template with Payload CMS',
}

type FrontendLayoutProps = {
  children: React.ReactNode
}

export default function FrontendLayout({ children }: Readonly<FrontendLayoutProps>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
