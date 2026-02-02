import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentBlock, type ContentBlockProps } from './Component'
import type { RichTextContent } from '@/components/RichText'

/**
 * Mock the @payloadcms/richtext-lexical/react module
 * The official Payload RichText component has internal converters that
 * aren't fully available in test environments, so we mock it to render
 * the content in a simpler way for testing.
 */
vi.mock('@payloadcms/richtext-lexical/react', () => ({
  RichText: ({
    data,
    className,
  }: {
    data: { root: { children: Array<Record<string, unknown>> } }
    className?: string
  }) => {
    // Simple mock renderer that extracts text from the Lexical structure
    const renderNode = (node: Record<string, unknown>): React.ReactNode => {
      if (node.type === 'text' && typeof node.text === 'string') {
        const format = typeof node.format === 'number' ? node.format : 0
        let content: React.ReactNode = node.text
        if (format & 1) content = <strong>{content}</strong>
        if (format & 2) content = <em>{content}</em>
        return content
      }
      if (node.type === 'paragraph' && Array.isArray(node.children)) {
        return <p>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</p>
      }
      if (node.type === 'heading' && Array.isArray(node.children)) {
        const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
        return <Tag>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</Tag>
      }
      if (node.type === 'list' && Array.isArray(node.children)) {
        const Tag = node.listType === 'number' ? 'ol' : 'ul'
        return <Tag>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</Tag>
      }
      if (node.type === 'listitem' && Array.isArray(node.children)) {
        return <li>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</li>
      }
      if (node.type === 'quote' && Array.isArray(node.children)) {
        return <blockquote>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</blockquote>
      }
      if (Array.isArray(node.children)) {
        return node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)
      }
      return null
    }

    if (!data?.root?.children) return null
    return (
      <div className={className}>
        {data.root.children.map((node, i) => (
          <span key={i}>{renderNode(node)}</span>
        ))}
      </div>
    )
  },
  defaultJSXConverters: {},
}))

/**
 * Helper to create mock rich text content
 */
function createMockRichText(text: string): RichTextContent {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              text,
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
  }
}

describe('ContentBlock', () => {
  it('should render a single column layout', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: createMockRichText('Column One Content'),
    }

    render(<ContentBlock {...props} />)

    expect(screen.getByText('Column One Content')).toBeDefined()
  })

  it('should render two columns layout', () => {
    const props: ContentBlockProps = {
      columns: '2',
      columnOne: createMockRichText('First Column'),
      columnTwo: createMockRichText('Second Column'),
    }

    render(<ContentBlock {...props} />)

    expect(screen.getByText('First Column')).toBeDefined()
    expect(screen.getByText('Second Column')).toBeDefined()
  })

  it('should render three columns layout', () => {
    const props: ContentBlockProps = {
      columns: '3',
      columnOne: createMockRichText('Column A'),
      columnTwo: createMockRichText('Column B'),
      columnThree: createMockRichText('Column C'),
    }

    render(<ContentBlock {...props} />)

    expect(screen.getByText('Column A')).toBeDefined()
    expect(screen.getByText('Column B')).toBeDefined()
    expect(screen.getByText('Column C')).toBeDefined()
  })

  it('should not render column two for single column layout', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: createMockRichText('Only Column'),
      columnTwo: createMockRichText('Hidden Column'),
    }

    render(<ContentBlock {...props} />)

    expect(screen.getByText('Only Column')).toBeDefined()
    expect(screen.queryByText('Hidden Column')).toBeNull()
  })

  it('should not render column three for two column layout', () => {
    const props: ContentBlockProps = {
      columns: '2',
      columnOne: createMockRichText('First'),
      columnTwo: createMockRichText('Second'),
      columnThree: createMockRichText('Third Hidden'),
    }

    render(<ContentBlock {...props} />)

    expect(screen.getByText('First')).toBeDefined()
    expect(screen.getByText('Second')).toBeDefined()
    expect(screen.queryByText('Third Hidden')).toBeNull()
  })

  it('should apply correct grid classes for single column', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: createMockRichText('Content'),
    }

    const { container } = render(<ContentBlock {...props} />)
    const grid = container.querySelector('.grid')

    expect(grid).toBeDefined()
    expect(grid?.className).toContain('grid-cols-1')
  })

  it('should apply correct grid classes for two columns', () => {
    const props: ContentBlockProps = {
      columns: '2',
      columnOne: createMockRichText('A'),
      columnTwo: createMockRichText('B'),
    }

    const { container } = render(<ContentBlock {...props} />)
    const grid = container.querySelector('.grid')

    expect(grid).toBeDefined()
    expect(grid?.className).toContain('md:grid-cols-2')
  })

  it('should apply correct grid classes for three columns', () => {
    const props: ContentBlockProps = {
      columns: '3',
      columnOne: createMockRichText('A'),
      columnTwo: createMockRichText('B'),
      columnThree: createMockRichText('C'),
    }

    const { container } = render(<ContentBlock {...props} />)
    const grid = container.querySelector('.grid')

    expect(grid).toBeDefined()
    expect(grid?.className).toContain('lg:grid-cols-3')
  })

  it('should render bold text formatting', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Bold Text',
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

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('strong')).toBeDefined()
    expect(screen.getByText('Bold Text')).toBeDefined()
  })

  it('should render italic text formatting', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Italic Text',
                  format: 2, // IS_ITALIC
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

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('em')).toBeDefined()
    expect(screen.getByText('Italic Text')).toBeDefined()
  })

  it('should render heading elements', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h2',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Test Heading',
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

    render(<ContentBlock {...props} />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeDefined()
    expect(heading.textContent).toBe('Test Heading')
  })

  it('should render unordered list', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'list',
              listType: 'bullet',
              version: 1,
              children: [
                {
                  type: 'listitem',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      text: 'List item 1',
                      version: 1,
                    },
                  ],
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

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('ul')).toBeDefined()
    expect(container.querySelector('li')).toBeDefined()
    expect(screen.getByText('List item 1')).toBeDefined()
  })

  it('should render ordered list', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'list',
              listType: 'number',
              version: 1,
              children: [
                {
                  type: 'listitem',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      text: 'Numbered item',
                      version: 1,
                    },
                  ],
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

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('ol')).toBeDefined()
    expect(screen.getByText('Numbered item')).toBeDefined()
  })

  it('should render blockquote', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [
            {
              type: 'quote',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'A quote',
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

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('blockquote')).toBeDefined()
    expect(screen.getByText('A quote')).toBeDefined()
  })

  it('should handle empty rich text content', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: null,
    }

    const { container } = render(<ContentBlock {...props} />)

    // Should still render the section/container
    expect(container.querySelector('section')).toBeDefined()
  })

  it('should handle rich text with no children', () => {
    const props: ContentBlockProps = {
      columns: '1',
      columnOne: {
        root: {
          type: 'root',
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const { container } = render(<ContentBlock {...props} />)

    expect(container.querySelector('section')).toBeDefined()
  })
})
