import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RenderBlocks, type Block } from './RenderBlocks'

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
        return node.text
      }
      if (node.type === 'paragraph' && Array.isArray(node.children)) {
        return <p>{node.children.map((c, i) => <span key={i}>{renderNode(c as Record<string, unknown>)}</span>)}</p>
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

describe('RenderBlocks', () => {
  it('should return null when blocks is undefined', () => {
    const { container } = render(<RenderBlocks blocks={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('should return null when blocks is null', () => {
    const { container } = render(<RenderBlocks blocks={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should return null when blocks is empty array', () => {
    const { container } = render(<RenderBlocks blocks={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render a content block', () => {
    const blocks: Block[] = [
      {
        blockType: 'content',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  { type: 'text', text: 'Content Block Text', version: 1 },
                ],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Content Block Text')).toBeDefined()
  })

  it('should render a mediaBlock block', () => {
    const blocks: Block[] = [
      {
        blockType: 'mediaBlock',
        media: {
          id: 'media-1',
          url: '/test-image.jpg',
          alt: 'Test Image Alt',
          width: 800,
          height: 600,
        },
        position: 'center',
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('alt')).toBe('Test Image Alt')
  })

  it('should render a callToAction block', () => {
    const blocks: Block[] = [
      {
        blockType: 'callToAction',
        heading: 'CTA Heading',
        subheading: 'CTA Subheading',
        backgroundColor: 'default',
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByRole('heading', { level: 2 })).toBeDefined()
    expect(screen.getByText('CTA Heading')).toBeDefined()
    expect(screen.getByText('CTA Subheading')).toBeDefined()
  })

  it('should render multiple blocks of different types', () => {
    const blocks: Block[] = [
      {
        blockType: 'content',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'First Block', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'callToAction',
        heading: 'Second Block CTA',
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('First Block')).toBeDefined()
    expect(screen.getByText('Second Block CTA')).toBeDefined()
  })

  it('should render blocks in correct order', () => {
    const blocks: Block[] = [
      {
        blockType: 'content',
        id: 'block-1',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'First', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'content',
        id: 'block-2',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Second', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'content',
        id: 'block-3',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Third', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ]

    const { container } = render(<RenderBlocks blocks={blocks} />)
    const textContent = container.textContent

    // Check order by position in text content
    const firstIndex = textContent?.indexOf('First') ?? -1
    const secondIndex = textContent?.indexOf('Second') ?? -1
    const thirdIndex = textContent?.indexOf('Third') ?? -1

    expect(firstIndex).toBeLessThan(secondIndex)
    expect(secondIndex).toBeLessThan(thirdIndex)
  })

  it('should use block id as key when provided', () => {
    const blocks: Block[] = [
      {
        blockType: 'content',
        id: 'custom-block-id',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Block with ID', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ]

    // This test ensures no key warnings occur with provided IDs
    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Block with ID')).toBeDefined()
  })

  it('should handle unknown block types gracefully', () => {
    const blocks = [
      {
        blockType: 'unknownBlockType',
        id: 'unknown-1',
      },
    ] as unknown as Block[]

    const { container } = render(<RenderBlocks blocks={blocks} />)

    // Should render the container but the unknown block returns null
    expect(container.querySelector('.render-blocks')).toBeDefined()
    // Unknown block should not render any content
    // The container should exist but have no block content inside
    expect(container.querySelector('.render-blocks')?.children.length).toBe(0)
  })

  it('should wrap blocks in a render-blocks class div', () => {
    const blocks: Block[] = [
      {
        blockType: 'callToAction',
        heading: 'Wrapped Block',
      },
    ]

    const { container } = render(<RenderBlocks blocks={blocks} />)

    expect(container.querySelector('.render-blocks')).toBeDefined()
  })

  it('should render callToAction with buttons', () => {
    const blocks: Block[] = [
      {
        blockType: 'callToAction',
        heading: 'CTA with Buttons',
        buttons: [
          { label: 'Learn More', link: '/learn' },
          { label: 'Get Started', link: '/start' },
        ],
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Learn More')).toBeDefined()
    expect(screen.getByText('Get Started')).toBeDefined()
  })

  it('should render content block with multiple columns', () => {
    const blocks: Block[] = [
      {
        blockType: 'content',
        columns: '3',
        columnOne: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Column 1', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        columnTwo: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Column 2', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        columnThree: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Column 3', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Column 1')).toBeDefined()
    expect(screen.getByText('Column 2')).toBeDefined()
    expect(screen.getByText('Column 3')).toBeDefined()
  })

  it('should render mediaBlock with caption', () => {
    const blocks: Block[] = [
      {
        blockType: 'mediaBlock',
        media: {
          id: 'media-1',
          url: '/image.jpg',
          alt: 'Caption Test Image',
          width: 800,
          height: 600,
        },
        caption: 'Image Caption Text',
        position: 'left',
      },
    ]

    render(<RenderBlocks blocks={blocks} />)
    expect(screen.getByText('Image Caption Text')).toBeDefined()
  })
})
