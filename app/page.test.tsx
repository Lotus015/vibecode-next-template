import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  it('should render the Jigjoy logo', () => {
    render(<HomePage />)
    const logo = screen.getByAltText(/jigjoy logo/i)
    expect(logo).toBeDefined()
    expect(logo.getAttribute('src')).toBe('/jigjoy.svg')
  })

  it('should render the subtitle', () => {
    render(<HomePage />)
    const subtitle = screen.getByText(/AI-safe Next.js template/i)
    expect(subtitle).toBeDefined()
  })

  it('should render the community CTA', () => {
    render(<HomePage />)
    const cta = screen.getByText(/join our community/i)
    expect(cta).toBeDefined()
  })

  it('should render Discord link with correct href', () => {
    render(<HomePage />)
    const discordLink = screen.getByLabelText(/join our discord/i)
    expect(discordLink).toBeDefined()
    expect(discordLink.getAttribute('href')).toBe('https://discord.gg/xQR6DNtY')
  })

  it('should render GitHub link with correct href', () => {
    render(<HomePage />)
    const githubLink = screen.getByLabelText(/visit our github/i)
    expect(githubLink).toBeDefined()
    expect(githubLink.getAttribute('href')).toBe('https://github.com/jigjoy-io')
  })

  it('should render website link with correct href', () => {
    render(<HomePage />)
    const websiteLink = screen.getByLabelText(/visit our website/i)
    expect(websiteLink).toBeDefined()
    expect(websiteLink.getAttribute('href')).toBe('https://jigjoy.io')
  })

  it('should have target="_blank" on all external links', () => {
    render(<HomePage />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })
  })
})
