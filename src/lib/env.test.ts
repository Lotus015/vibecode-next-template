import { describe, it, expect } from 'vitest'
import { env } from './env'

describe('env validation', () => {
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
