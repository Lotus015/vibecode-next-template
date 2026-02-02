import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getServerSideURL, getClientSideURL } from './getURL'

describe('getServerSideURL', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_SERVER_URL
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return NEXT_PUBLIC_SERVER_URL when set', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://example.com'
    // Need to re-import since env is read at module load
    const result = getServerSideURL()
    expect(result).toBe('https://example.com')
  })

  it('should return NEXT_PUBLIC_SERVER_URL without trailing slash', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://example.com/'
    const result = getServerSideURL()
    expect(result).toBe('https://example.com')
  })

  it('should use VERCEL_PROJECT_PRODUCTION_URL when NEXT_PUBLIC_SERVER_URL is not set', () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'my-project.vercel.app'
    const result = getServerSideURL()
    expect(result).toBe('https://my-project.vercel.app')
  })

  it('should return localhost fallback when no env vars are set', () => {
    const result = getServerSideURL()
    expect(result).toBe('http://localhost:3000')
  })
})

describe('getClientSideURL', () => {
  const originalEnv = process.env
  const originalWindow = global.window

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_SERVER_URL
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL
  })

  afterEach(() => {
    process.env = originalEnv
    global.window = originalWindow
  })

  it('should return window.location.origin in browser environment', () => {
    // Mock window object
    global.window = {
      ...global.window,
      location: {
        ...global.window?.location,
        origin: 'https://client-side.com',
      },
    } as typeof window

    const result = getClientSideURL()
    expect(result).toBe('https://client-side.com')
  })

  it('should fall back to getServerSideURL when window is undefined', () => {
    // Ensure window is undefined (server environment)
    // @ts-expect-error - intentionally setting window to undefined
    global.window = undefined

    process.env.NEXT_PUBLIC_SERVER_URL = 'https://server-side.com'
    const result = getClientSideURL()
    expect(result).toBe('https://server-side.com')
  })

  it('should use localhost fallback on server when no env vars set', () => {
    // @ts-expect-error - intentionally setting window to undefined
    global.window = undefined

    const result = getClientSideURL()
    expect(result).toBe('http://localhost:3000')
  })
})
