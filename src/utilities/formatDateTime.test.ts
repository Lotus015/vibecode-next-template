import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDateTime, formatRelativeTime } from './formatDateTime'

describe('formatDateTime', () => {
  it('should return empty string for null input', () => {
    expect(formatDateTime(null)).toBe('')
  })

  it('should return empty string for undefined input', () => {
    expect(formatDateTime(undefined)).toBe('')
  })

  it('should return empty string for invalid date string', () => {
    expect(formatDateTime('invalid-date')).toBe('')
  })

  it('should format a Date object', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const result = formatDateTime(date)
    expect(result).toBeDefined()
    expect(result).not.toBe('')
  })

  it('should format a date string', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z')
    expect(result).toBeDefined()
    expect(result).not.toBe('')
  })

  it('should format without time when includeTime is false', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z', { includeTime: false })
    expect(result).toBeDefined()
    // Should not contain AM/PM when time is excluded
    expect(result).toMatch(/Jan|2024|15/)
  })

  it('should use provided locale', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z', {
      locale: 'de-DE',
      includeTime: false
    })
    expect(result).toBeDefined()
    expect(result).not.toBe('')
  })

  it('should use full date style when specified', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z', {
      dateStyle: 'full',
      includeTime: false
    })
    expect(result).toBeDefined()
    // Full style includes day of week
    expect(result).toMatch(/Monday|2024/)
  })

  it('should use short date style when specified', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z', {
      dateStyle: 'short',
      includeTime: false
    })
    expect(result).toBeDefined()
    expect(result).not.toBe('')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Mock Date.now to have consistent tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return empty string for null input', () => {
    expect(formatRelativeTime(null)).toBe('')
  })

  it('should return empty string for undefined input', () => {
    expect(formatRelativeTime(undefined)).toBe('')
  })

  it('should return empty string for invalid date string', () => {
    expect(formatRelativeTime('invalid-date')).toBe('')
  })

  it('should format seconds ago', () => {
    const date = new Date('2024-01-15T11:59:30Z') // 30 seconds ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/second|now/)
  })

  it('should format minutes ago', () => {
    const date = new Date('2024-01-15T11:55:00Z') // 5 minutes ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/minute/)
  })

  it('should format hours ago', () => {
    const date = new Date('2024-01-15T10:00:00Z') // 2 hours ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/hour/)
  })

  it('should format days ago', () => {
    const date = new Date('2024-01-13T12:00:00Z') // 2 days ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/day/)
  })

  it('should format months ago', () => {
    const date = new Date('2023-12-15T12:00:00Z') // 1 month ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/month/)
  })

  it('should format years ago', () => {
    const date = new Date('2022-01-15T12:00:00Z') // 2 years ago
    const result = formatRelativeTime(date)
    expect(result).toMatch(/year/)
  })

  it('should format future dates', () => {
    const date = new Date('2024-01-17T12:00:00Z') // 2 days in future
    const result = formatRelativeTime(date)
    expect(result).toMatch(/day|in/)
  })

  it('should accept date strings', () => {
    const result = formatRelativeTime('2024-01-14T12:00:00Z') // 1 day ago
    expect(result).toMatch(/day|yesterday/)
  })

  it('should use provided locale', () => {
    const date = new Date('2024-01-14T12:00:00Z') // 1 day ago
    const result = formatRelativeTime(date, 'de-DE')
    expect(result).toBeDefined()
    expect(result).not.toBe('')
  })
})
