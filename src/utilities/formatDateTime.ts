/**
 * Options for date/time formatting.
 */
interface FormatDateTimeOptions {
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** Whether to include time (default: true) */
  includeTime?: boolean
  /** Date format style (default: 'medium') */
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  /** Time format style (default: 'short') */
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
}

/**
 * Formats a date string or Date object into a human-readable format.
 * Uses Intl.DateTimeFormat for locale-aware formatting.
 *
 * @param dateInput - The date to format (string, Date, or null/undefined)
 * @param options - Formatting options
 * @returns Formatted date string, or empty string if input is invalid
 *
 * @example
 * formatDateTime('2024-01-15T10:30:00Z')
 * // Returns: "Jan 15, 2024, 10:30 AM"
 *
 * @example
 * formatDateTime('2024-01-15', { includeTime: false })
 * // Returns: "Jan 15, 2024"
 *
 * @example
 * formatDateTime('2024-01-15', { dateStyle: 'full', locale: 'en-GB' })
 * // Returns: "Monday, 15 January 2024"
 */
export function formatDateTime(
  dateInput: string | Date | null | undefined,
  options: FormatDateTimeOptions = {}
): string {
  const {
    locale = 'en-US',
    includeTime = true,
    dateStyle = 'medium',
    timeStyle = 'short',
  } = options

  if (!dateInput) {
    return ''
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

    // Check for invalid date
    if (isNaN(date.getTime())) {
      return ''
    }

    const formatOptions: Intl.DateTimeFormatOptions = includeTime
      ? { dateStyle, timeStyle }
      : { dateStyle }

    return new Intl.DateTimeFormat(locale, formatOptions).format(date)
  } catch {
    return ''
  }
}

/**
 * Formats a date as a relative time string (e.g., "2 days ago", "in 3 hours").
 * Uses Intl.RelativeTimeFormat for locale-aware formatting.
 *
 * @param dateInput - The date to format (string, Date, or null/undefined)
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Relative time string, or empty string if input is invalid
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000))
 * // Returns: "1 day ago"
 */
export function formatRelativeTime(
  dateInput: string | Date | null | undefined,
  locale = 'en-US'
): string {
  if (!dateInput) {
    return ''
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

    if (isNaN(date.getTime())) {
      return ''
    }

    const now = new Date()
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)
    const absDiff = Math.abs(diffInSeconds)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    // Determine the best unit to use
    if (absDiff < 60) {
      return rtf.format(diffInSeconds, 'second')
    } else if (absDiff < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute')
    } else if (absDiff < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour')
    } else if (absDiff < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day')
    } else if (absDiff < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), 'month')
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), 'year')
    }
  } catch {
    return ''
  }
}
