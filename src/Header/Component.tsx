'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

/**
 * Navigation item type
 */
interface NavItem {
  label: string
  link: string
  id?: string
}

/**
 * CTA Button type
 */
interface CTAButton {
  label?: string | null
  link?: string | null
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | null
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
 * Header data type from Payload
 */
export interface HeaderData {
  logo?: Logo | string | null
  navItems?: NavItem[] | null
  ctaButton?: CTAButton | null
}

interface HeaderProps {
  data?: HeaderData | null
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
 * Header Component
 *
 * Renders the site header with:
 * - Logo (linked to homepage)
 * - Navigation items (desktop: inline, mobile: hamburger menu)
 * - CTA button
 *
 * Mobile-responsive with sheet-based hamburger menu
 */
export function Header({ data }: HeaderProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false)

  const logoUrl = getLogoUrl(data?.logo as Logo | string | null | undefined)
  const logoAlt = getLogoAlt(data?.logo as Logo | string | null | undefined)
  const navItems = data?.navItems ?? []
  const ctaButton = data?.ctaButton

  const hasCta = ctaButton?.label && ctaButton?.link

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          ) : (
            <span className="text-xl font-bold">Logo</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id ?? item.link}
              href={item.link}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {hasCta && (
            <Button variant={ctaButton.variant ?? 'default'} asChild>
              <Link href={ctaButton.link ?? '#'}>{ctaButton.label}</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.id ?? item.link}
                    href={item.link}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {hasCta && (
                  <Button
                    variant={ctaButton.variant ?? 'default'}
                    className="mt-4"
                    asChild
                  >
                    <Link href={ctaButton.link ?? '#'} onClick={() => setIsOpen(false)}>
                      {ctaButton.label}
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
