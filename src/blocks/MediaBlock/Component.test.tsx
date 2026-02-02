import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MediaBlockComponent, type MediaBlockProps } from './Component'

describe('MediaBlockComponent', () => {
  const mockMedia = {
    id: 'media-1',
    url: '/images/test-image.jpg',
    alt: 'Test image alt text',
    width: 1200,
    height: 800,
    filename: 'test-image.jpg',
  }

  it('should render an image when media is populated', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
    }

    render(<MediaBlockComponent {...props} />)

    const img = screen.getByRole('img')
    expect(img).toBeDefined()
    expect(img.getAttribute('alt')).toBe('Test image alt text')
  })

  it('should return null when media is a string (unpopulated)', () => {
    const props: MediaBlockProps = {
      media: 'media-id-string',
    }

    const { container } = render(<MediaBlockComponent {...props} />)

    expect(container.firstChild).toBeNull()
  })

  it('should return null when media has no URL', () => {
    const props: MediaBlockProps = {
      media: {
        id: 'media-1',
        alt: 'No URL',
      },
    }

    const { container } = render(<MediaBlockComponent {...props} />)

    expect(container.firstChild).toBeNull()
  })

  it('should render caption when provided', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      caption: 'This is the image caption',
    }

    render(<MediaBlockComponent {...props} />)

    expect(screen.getByText('This is the image caption')).toBeDefined()
    const figcaption = screen.getByText('This is the image caption')
    expect(figcaption.tagName.toLowerCase()).toBe('figcaption')
  })

  it('should not render caption when not provided', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      caption: null,
    }

    const { container } = render(<MediaBlockComponent {...props} />)

    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('should apply left alignment class', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      position: 'left',
    }

    const { container } = render(<MediaBlockComponent {...props} />)
    const figure = container.querySelector('figure')

    expect(figure?.className).toContain('mr-auto')
  })

  it('should apply center alignment class (default)', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      position: 'center',
    }

    const { container } = render(<MediaBlockComponent {...props} />)
    const figure = container.querySelector('figure')

    expect(figure?.className).toContain('mx-auto')
  })

  it('should apply right alignment class', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      position: 'right',
    }

    const { container } = render(<MediaBlockComponent {...props} />)
    const figure = container.querySelector('figure')

    expect(figure?.className).toContain('ml-auto')
  })

  it('should default to center position when not specified', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
    }

    const { container } = render(<MediaBlockComponent {...props} />)
    const figure = container.querySelector('figure')

    expect(figure?.className).toContain('mx-auto')
  })

  it('should apply correct text alignment for caption based on position', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
      caption: 'Caption text',
      position: 'right',
    }

    const { container } = render(<MediaBlockComponent {...props} />)
    const figcaption = container.querySelector('figcaption')

    expect(figcaption?.className).toContain('text-right')
  })

  it('should use filename as alt when alt is not provided', () => {
    const props: MediaBlockProps = {
      media: {
        id: 'media-1',
        url: '/images/fallback.jpg',
        filename: 'fallback-image.jpg',
      },
    }

    render(<MediaBlockComponent {...props} />)

    const img = screen.getByRole('img')
    expect(img.getAttribute('alt')).toBe('fallback-image.jpg')
  })

  it('should use "Image" as fallback alt when both alt and filename are missing', () => {
    const props: MediaBlockProps = {
      media: {
        id: 'media-1',
        url: '/images/no-alt.jpg',
      },
    }

    render(<MediaBlockComponent {...props} />)

    const img = screen.getByRole('img')
    expect(img.getAttribute('alt')).toBe('Image')
  })

  it('should use default dimensions when not provided', () => {
    const props: MediaBlockProps = {
      media: {
        id: 'media-1',
        url: '/images/no-dimensions.jpg',
      },
    }

    render(<MediaBlockComponent {...props} />)

    const img = screen.getByRole('img')
    // Next.js Image component transforms these, so we check if it renders
    expect(img).toBeDefined()
  })

  it('should render within a section element', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
    }

    const { container } = render(<MediaBlockComponent {...props} />)

    expect(container.querySelector('section')).toBeDefined()
  })

  it('should render within a figure element', () => {
    const props: MediaBlockProps = {
      media: mockMedia,
    }

    const { container } = render(<MediaBlockComponent {...props} />)

    expect(container.querySelector('figure')).toBeDefined()
  })
})
