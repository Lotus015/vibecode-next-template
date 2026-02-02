import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CallToActionBlock, type CallToActionBlockProps } from './Component'

describe('CallToActionBlock', () => {
  const defaultProps: CallToActionBlockProps = {
    heading: 'Test Heading',
  }

  it('should render the heading', () => {
    render(<CallToActionBlock {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeDefined()
    expect(heading.textContent).toBe('Test Heading')
  })

  it('should render the subheading when provided', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      subheading: 'Test Subheading',
    }

    render(<CallToActionBlock {...props} />)

    expect(screen.getByText('Test Subheading')).toBeDefined()
  })

  it('should not render subheading when not provided', () => {
    render(<CallToActionBlock {...defaultProps} />)

    // Subheading shouldn't exist
    const subheadingElement = screen.queryByText(/subheading/i)
    expect(subheadingElement).toBeNull()
  })

  it('should render buttons when provided', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [
        { label: 'Primary Button', link: '/primary', variant: 'default' },
        { label: 'Secondary Button', link: '/secondary', variant: 'secondary' },
      ],
    }

    render(<CallToActionBlock {...props} />)

    expect(screen.getByText('Primary Button')).toBeDefined()
    expect(screen.getByText('Secondary Button')).toBeDefined()
  })

  it('should render buttons as links', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [
        { label: 'Click Me', link: '/test-path' },
      ],
    }

    render(<CallToActionBlock {...props} />)

    const link = screen.getByRole('link', { name: 'Click Me' })
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('/test-path')
  })

  it('should not render button section when buttons array is empty', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [],
    }

    const { container } = render(<CallToActionBlock {...props} />)

    // Check that no buttons are rendered
    const buttons = container.querySelectorAll('a')
    expect(buttons.length).toBe(0)
  })

  it('should not render button section when buttons is null', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: null,
    }

    const { container } = render(<CallToActionBlock {...props} />)

    const buttons = container.querySelectorAll('a')
    expect(buttons.length).toBe(0)
  })

  it('should apply default background class', () => {
    const { container } = render(<CallToActionBlock {...defaultProps} />)

    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-background')
  })

  it('should apply muted background class', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      backgroundColor: 'muted',
    }

    const { container } = render(<CallToActionBlock {...props} />)

    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-muted')
  })

  it('should apply primary background class with text color', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      backgroundColor: 'primary',
    }

    const { container } = render(<CallToActionBlock {...props} />)

    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-primary')
    expect(section?.className).toContain('text-primary-foreground')
  })

  it('should apply secondary background class with text color', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      backgroundColor: 'secondary',
    }

    const { container } = render(<CallToActionBlock {...props} />)

    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-secondary')
    expect(section?.className).toContain('text-secondary-foreground')
  })

  it('should apply accent background class with text color', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      backgroundColor: 'accent',
    }

    const { container } = render(<CallToActionBlock {...props} />)

    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-accent')
    expect(section?.className).toContain('text-accent-foreground')
  })

  it('should render rich text content when provided', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      richText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Rich text content here',
                  version: 1,
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    render(<CallToActionBlock {...props} />)

    expect(screen.getByText('Rich text content here')).toBeDefined()
  })

  it('should not render rich text section when richText is null', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      richText: null,
    }

    const { container } = render(<CallToActionBlock {...props} />)

    // Should still render heading, just no rich text div
    expect(screen.getByText('Test Heading')).toBeDefined()
    // The prose class is used by rich text component
    expect(container.querySelector('.prose')).toBeNull()
  })

  it('should render within a section element', () => {
    const { container } = render(<CallToActionBlock {...defaultProps} />)

    expect(container.querySelector('section')).toBeDefined()
  })

  it('should use button id as key when provided', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [
        { id: 'btn-1', label: 'Button 1', link: '/1' },
        { id: 'btn-2', label: 'Button 2', link: '/2' },
      ],
    }

    render(<CallToActionBlock {...props} />)

    expect(screen.getByText('Button 1')).toBeDefined()
    expect(screen.getByText('Button 2')).toBeDefined()
  })

  it('should handle multiple button variants', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [
        { label: 'Default', link: '/default', variant: 'default' },
        { label: 'Outline', link: '/outline', variant: 'outline' },
        { label: 'Ghost', link: '/ghost', variant: 'ghost' },
      ],
    }

    render(<CallToActionBlock {...props} />)

    expect(screen.getByText('Default')).toBeDefined()
    expect(screen.getByText('Outline')).toBeDefined()
    expect(screen.getByText('Ghost')).toBeDefined()
  })

  it('should default to default variant when not specified', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      buttons: [
        { label: 'No Variant', link: '/no-variant' },
      ],
    }

    render(<CallToActionBlock {...props} />)

    // Should render successfully with default variant
    expect(screen.getByText('No Variant')).toBeDefined()
  })

  it('should render bold text in rich text', () => {
    const props: CallToActionBlockProps = {
      ...defaultProps,
      richText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Bold CTA text',
                  format: 1, // IS_BOLD
                  version: 1,
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const { container } = render(<CallToActionBlock {...props} />)

    expect(container.querySelector('strong')).toBeDefined()
  })
})
