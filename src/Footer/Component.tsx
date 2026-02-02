'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from 'lucide-react'

/**
 * Link item type
 */
interface LinkItem {
  label: string
  link: string
  id?: string
}

/**
 * Column type
 */
interface Column {
  title: string
  links?: LinkItem[] | null
  id?: string
}

/**
 * Social link type
 */
interface SocialLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'github' | 'tiktok'
  url: string
  id?: string
}

/**
 * Logo type from Media collection
 */
interface Logo {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Footer data type from Payload
 */
export interface FooterData {
  logo?: Logo | string | null
  columns?: Column[] | null
  socialLinks?: SocialLink[] | null
  copyright?: string | null
}

interface FooterProps {
  data?: FooterData | null
}

/**
 * Get logo URL from logo field (handles both populated and unpopulated states)
 */
function getLogoUrl(logo: Logo | string | null | undefined): string | null {
  if (!logo) return null
  if (typeof logo === 'string') return null // Unpopulated relationship
  return logo.url ?? null
}

/**
 * Get logo alt text
 */
function getLogoAlt(logo: Logo | string | null | undefined): string {
  if (!logo) return 'Site Logo'
  if (typeof logo === 'string') return 'Site Logo'
  return logo.alt ?? 'Site Logo'
}

/**
 * Social icon component map
 */
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
}

/**
 * TikTok icon (not available in lucide-react, using custom SVG)
 */
function TikTokIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

/**
 * Get social icon for platform
 */
function getSocialIcon(platform: string): React.ComponentType<{ className?: string }> {
  if (platform === 'tiktok') return TikTokIcon
  return socialIcons[platform] || Twitter
}

/**
 * Get platform label for accessibility
 */
function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    twitter: 'Twitter / X',
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    github: 'GitHub',
    tiktok: 'TikTok',
  }
  return labels[platform] || platform
}

/**
 * Footer Component
 *
 * Renders the site footer with:
 * - Optional logo
 * - Multi-column link layout
 * - Social media links with icons
 * - Copyright text
 */
export function Footer({ data }: FooterProps): React.JSX.Element {
  const logoUrl = getLogoUrl(data?.logo as Logo | string | null | undefined)
  const logoAlt = getLogoAlt(data?.logo as Logo | string | null | undefined)
  const columns = data?.columns ?? []
  const socialLinks = data?.socialLinks ?? []
  const copyright = data?.copyright

  const currentYear = new Date().getFullYear()
  const defaultCopyright = `© ${currentYear} All rights reserved.`

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Logo and description column */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold">Logo</span>
              )}
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.id ?? column.title} className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links?.map((link) => (
                  <li key={link.id ?? link.link}>
                    <Link
                      href={link.link}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with social links and copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = getSocialIcon(social.platform)
                const label = getPlatformLabel(social.platform)
                return (
                  <a
                    key={social.id ?? social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {copyright || defaultCopyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
