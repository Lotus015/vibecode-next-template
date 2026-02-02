import { getPayload as getPayloadInstance } from 'payload'
import type { Payload } from 'payload'

import config from '@payload-config'

/**
 * Custom error class for Payload initialization failures.
 * Used to provide a clear error when database connection fails.
 */
export class PayloadInitError extends Error {
  public payloadInitError = true

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'PayloadInitError'
    this.cause = cause
  }
}

/**
 * Gets a cached Payload instance for server-side data fetching.
 *
 * This utility provides a standardized way to get the Payload client
 * in Server Components and API routes. The instance is cached by Payload
 * to avoid creating multiple connections.
 *
 * @returns Promise resolving to the Payload instance
 * @throws PayloadInitError when database connection fails
 */
export async function getPayload(): Promise<Payload> {
  try {
    return await getPayloadInstance({ config })
  } catch (error) {
    // Wrap undefined errors or provide a clear error message
    const message = error instanceof Error
      ? error.message
      : 'Failed to initialize Payload CMS. Is the database running?'

    throw new PayloadInitError(message, error)
  }
}
