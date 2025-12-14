import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Polyfill for React 19's act function
// React 19 moved act from react-dom/test-utils to the react package
import { act } from 'react'

// Mock react-dom/test-utils to use React's act
vi.mock('react-dom/test-utils', () => ({
  act,
}))
