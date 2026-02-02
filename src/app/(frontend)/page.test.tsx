import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from './page'

// Mock the utilities module to avoid Payload CMS initialization
vi.mock('@/utilities', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn().mockResolvedValue({ docs: [] }),
  }),
}))

// Mock the Hero component since it's a separate concern
vi.mock('@/components/Hero', () => ({
  Hero: ({ hero }: { hero?: unknown }) => (
    <div data-testid="hero">{hero ? 'Hero Content' : 'No Hero'}</div>
  ),
}))

// Mock the RenderBlocks component since it's a separate concern
vi.mock('@/blocks/RenderBlocks', () => ({
  RenderBlocks: ({ blocks }: { blocks?: unknown[] | null }) => (
    <div data-testid="blocks">{blocks?.length || 0} blocks</div>
  ),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render fallback content when no homepage data exists', async () => {
    // HomePage is an async Server Component, so we need to await it
    const Component = await HomePage()
    render(Component)

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeDefined()
      expect(heading.textContent).toBe('Welcome')
    })
  })

  it('should render main element', async () => {
    const Component = await HomePage()
    render(Component)

    const main = screen.getByRole('main')
    expect(main).toBeDefined()
  })

  it('should show instructions to create homepage', async () => {
    const Component = await HomePage()
    render(Component)

    await waitFor(() => {
      const instruction = screen.getByText(/Create a page with the slug/i)
      expect(instruction).toBeDefined()
    })
  })
})
