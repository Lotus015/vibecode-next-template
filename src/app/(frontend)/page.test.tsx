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

  it('should render demo content when no homepage data exists in CMS', async () => {
    // HomePage is an async Server Component, so we need to await it
    const Component = await HomePage()
    render(Component)

    await waitFor(() => {
      // Should render demo hero
      const hero = screen.getByTestId('hero')
      expect(hero).toBeDefined()
      expect(hero.textContent).toBe('Hero Content')

      // Should render demo blocks (2 blocks from demoHomeBlocks)
      const blocks = screen.getByTestId('blocks')
      expect(blocks).toBeDefined()
      expect(blocks.textContent).toContain('2')
    })
  })

  it('should render main element', async () => {
    const Component = await HomePage()
    render(Component)

    const main = screen.getByRole('main')
    expect(main).toBeDefined()
  })

  it('should render hero and blocks components', async () => {
    const Component = await HomePage()
    render(Component)

    await waitFor(() => {
      expect(screen.getByTestId('hero')).toBeDefined()
      expect(screen.getByTestId('blocks')).toBeDefined()
    })
  })
})
