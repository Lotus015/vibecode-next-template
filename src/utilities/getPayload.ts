import { getPayload as getPayloadInstance } from 'payload'
import type { Payload } from 'payload'

import config from '@payload-config'

/**
 * Gets a cached Payload instance for server-side data fetching.
 *
 * This utility provides a standardized way to get the Payload client
 * in Server Components and API routes. The instance is cached by Payload
 * to avoid creating multiple connections.
 *
 * @returns Promise resolving to the Payload instance
 */
export async function getPayload(): Promise<Payload> {
  return getPayloadInstance({ config })
}
