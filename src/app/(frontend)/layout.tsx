import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import type { FooterData } from '@/Footer/Component'
import type { HeaderData } from '@/Header/Component'
import { getPayload } from '@/utilities'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

/**
 * SiteSettings type from Payload global
 */
interface SiteSettings {
  general?: {
    siteName?: string | null
    siteDescription?: string | null
    defaultOgImage?: {
      url?: string | null
    } | string | null
  } | null
  analytics?: {
    googleAnalyticsId?: string | null
    googleTagManagerId?: string | null
    facebookPixelId?: string | null
  } | null
}

/**
 * Default fallback values when data fetching fails
 */
const defaultSiteSettings: SiteSettings = {
  general: {
    siteName: 'Vibecode Next Template',
    siteDescription: 'AI-safe Next.js template with Payload CMS',
  },
}

const defaultHeaderData: HeaderData = {
  navItems: [],
  ctaButton: null,
  logo: null,
}

const defaultFooterData: FooterData = {
  columns: [],
  socialLinks: [],
  copyright: null,
  logo: null,
}

/**
 * Fetches Header global from Payload CMS with error handling
 */
async function getHeader(): Promise<HeaderData> {
  try {
    const payload = await getPayload()
    const header = await payload.findGlobal({
      slug: 'header',
      depth: 1,
    })
    return header as HeaderData
  } catch (error) {
    console.error('Failed to fetch header:', error)
    return defaultHeaderData
  }
}

/**
 * Fetches Footer global from Payload CMS with error handling
 */
async function getFooter(): Promise<FooterData> {
  try {
    const payload = await getPayload()
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 1,
    })
    return footer as FooterData
  } catch (error) {
    console.error('Failed to fetch footer:', error)
    return defaultFooterData
  }
}

/**
 * Fetches SiteSettings global from Payload CMS with error handling
 */
async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayload()
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    return siteSettings as SiteSettings
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return defaultSiteSettings
  }
}

/**
 * Generate metadata from SiteSettings
 */
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()

  const siteName = siteSettings.general?.siteName ?? 'Vibecode Next Template'
  const siteDescription = siteSettings.general?.siteDescription ?? 'AI-safe Next.js template with Payload CMS'

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
  }
}

type FrontendLayoutProps = {
  children: React.ReactNode
}

export default async function FrontendLayout({ children }: Readonly<FrontendLayoutProps>): Promise<React.JSX.Element> {
  // Fetch all globals in parallel for better performance
  const [headerData, footerData] = await Promise.all([
    getHeader(),
    getFooter(),
  ])

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header data={headerData} />
        <main className="min-h-screen">{children}</main>
        <Footer data={footerData} />
      </body>
    </html>
  )
}
