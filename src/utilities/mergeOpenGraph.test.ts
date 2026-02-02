import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mergeOpenGraph } from './mergeOpenGraph'

// Helper to access type safely for OpenGraph objects
function getOpenGraphType(og: ReturnType<typeof mergeOpenGraph>): string | undefined {
  return (og as { type?: string }).type
}

describe('mergeOpenGraph', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://example.com'
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return default OpenGraph when no custom values provided', () => {
    const result = mergeOpenGraph()

    expect(getOpenGraphType(result)).toBe('website')
    expect(result.siteName).toBe('Payload CMS')
    expect(result.title).toBe('Payload CMS')
    expect(result.description).toBe('A Next.js website with Payload CMS')
    expect(result.images).toBeDefined()
  })

  it('should merge custom title with defaults', () => {
    const result = mergeOpenGraph({
      title: 'Custom Title',
    })

    expect(result.title).toBe('Custom Title')
    expect(result.siteName).toBe('Payload CMS') // default preserved
    expect(getOpenGraphType(result)).toBe('website') // default preserved
  })

  it('should merge custom description with defaults', () => {
    const result = mergeOpenGraph({
      description: 'Custom description',
    })

    expect(result.description).toBe('Custom description')
    expect(result.siteName).toBe('Payload CMS') // default preserved
  })

  it('should override default images when custom images provided', () => {
    const customImages = [{ url: 'https://example.com/custom-image.png' }]
    const result = mergeOpenGraph({
      images: customImages,
    })

    expect(result.images).toEqual(customImages)
  })

  it('should use empty array when custom images is empty array', () => {
    const result = mergeOpenGraph({
      images: [],
    })

    // Empty array is truthy, so it overrides defaults
    expect(result.images).toHaveLength(0)
  })

  it('should override siteName when provided', () => {
    const result = mergeOpenGraph({
      siteName: 'My Custom Site',
    })

    expect(result.siteName).toBe('My Custom Site')
  })

  it('should override type when provided', () => {
    const result = mergeOpenGraph({
      type: 'article',
    })

    expect(getOpenGraphType(result)).toBe('article')
  })

  it('should merge all custom values at once', () => {
    const result = mergeOpenGraph({
      title: 'Custom Title',
      description: 'Custom description',
      siteName: 'Custom Site',
      type: 'article',
      images: [{ url: 'https://example.com/image.png' }],
    })

    expect(result.title).toBe('Custom Title')
    expect(result.description).toBe('Custom description')
    expect(result.siteName).toBe('Custom Site')
    expect(getOpenGraphType(result)).toBe('article')
    expect(result.images).toEqual([{ url: 'https://example.com/image.png' }])
  })

  it('should handle null input', () => {
    const result = mergeOpenGraph(null as never)

    expect(getOpenGraphType(result)).toBe('website')
    expect(result.siteName).toBe('Payload CMS')
  })

  it('should handle undefined input', () => {
    const result = mergeOpenGraph(undefined)

    expect(getOpenGraphType(result)).toBe('website')
    expect(result.siteName).toBe('Payload CMS')
  })
})
