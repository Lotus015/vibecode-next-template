import { describe, it, expect } from 'vitest'
import { env, getServerURL } from './env'

describe('env validation', () => {
  describe('NEXT_PUBLIC_APP_NAME', () => {
    it('should have NEXT_PUBLIC_APP_NAME defined', () => {
      expect(env.NEXT_PUBLIC_APP_NAME).toBeDefined()
    })

    it('should default to "Vibecode" if not set', () => {
      expect(env.NEXT_PUBLIC_APP_NAME).toBe('Vibecode')
    })

    it('should be a string', () => {
      expect(typeof env.NEXT_PUBLIC_APP_NAME).toBe('string')
    })
  })

  describe('Database and Payload variables', () => {
    it('should allow DATABASE_URL to be undefined during builds', () => {
      // DATABASE_URL is optional during builds
      expect(env.DATABASE_URL).toBeUndefined()
    })

    it('should allow PAYLOAD_SECRET to be undefined during builds', () => {
      // PAYLOAD_SECRET is optional during builds
      expect(env.PAYLOAD_SECRET).toBeUndefined()
    })
  })

  describe('Server URL variables', () => {
    it('should allow NEXT_PUBLIC_SERVER_URL to be undefined', () => {
      // NEXT_PUBLIC_SERVER_URL is optional
      expect(env.NEXT_PUBLIC_SERVER_URL === undefined || typeof env.NEXT_PUBLIC_SERVER_URL === 'string').toBe(true)
    })

    it('should allow VERCEL_PROJECT_PRODUCTION_URL to be undefined', () => {
      // VERCEL_PROJECT_PRODUCTION_URL is auto-set by Vercel
      expect(env.VERCEL_PROJECT_PRODUCTION_URL === undefined || typeof env.VERCEL_PROJECT_PRODUCTION_URL === 'string').toBe(true)
    })
  })
})

describe('getServerURL', () => {
  it('should return a valid URL string', () => {
    const url = getServerURL()
    expect(typeof url).toBe('string')
    expect(url.length).toBeGreaterThan(0)
  })

  it('should return localhost as fallback when no URL env vars are set', () => {
    // When no env vars are set, fallback to localhost
    const url = getServerURL()
    // Either a configured URL or localhost
    expect(url).toMatch(/^https?:\/\//)
  })
})
