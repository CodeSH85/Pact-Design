import { useEffect, type ComponentType } from 'react'
import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from './MdxComponents'
import { DocFooter } from '../layout/DocFooter'
import { TableOfContents } from '../layout/TableOfContents'

interface SpecFrontmatter {
  title?: string
  eyebrow?: string
  description?: string
}

interface MdxSpecModule {
  default: ComponentType<{ components?: MDXComponents }>
  frontmatter?: SpecFrontmatter
}

interface SpecRegistryEntry {
  id: string
  Content: MdxSpecModule['default']
  frontmatter: SpecFrontmatter
}

export interface SpecDocProps {
  id: string
  showHeader?: boolean
}

const mdxModules = import.meta.glob<MdxSpecModule>('../../../../docs/spec/*.mdx', { eager: true })

const specRegistry: Record<string, SpecRegistryEntry> = {}
for (const [filePath, mod] of Object.entries(mdxModules)) {
  const fileName = filePath.split('/').pop()
  if (!fileName) continue
  const id = fileName.replace(/\.mdx$/, '')
  specRegistry[id] = {
    id,
    Content: mod.default,
    frontmatter: mod.frontmatter ?? {}
  }
}

export function SpecDoc({ id, showHeader = true }: SpecDocProps) {
  const entry = specRegistry[id]
  const title = entry?.frontmatter.title || 'Pact Design'

  useEffect(() => {
    document.title = title === 'Pact Design'
      ? 'Pact Design · Design System'
      : `${title} | Pact Design`
  }, [title])

  if (!entry) {
    return (
      <div className="p-md bg-danger-subtle text-on-danger-subtle border border-danger-border rounded-xs text-body-sm">
        Spec markdown entry &ldquo;{id}&rdquo; not found in <code>docs/spec/{id}.mdx</code>
      </div>
    )
  }

  const { Content, frontmatter } = entry
  const { eyebrow, description } = frontmatter

  return (
    <div className="flex gap-2xl items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-xl">
        {showHeader && (
          <header className="flex flex-col gap-xs pb-md border-b border-border-default">
            {eyebrow && (
              <span className="text-mono-xs text-primary uppercase">{eyebrow}</span>
            )}
            <h1 className="text-heading-md text-on-surface">{title}</h1>
            {description && (
              <p className="text-subheader-sm text-on-surface-muted my-sm">
                {description}
              </p>
            )}
          </header>
        )}

        <article className="flex flex-col gap-md text-body-md text-on-surface">
          <MDXProvider components={mdxComponents}>
            <Content />
          </MDXProvider>
        </article>

        <DocFooter currentId={id} />
      </div>

      <TableOfContents pageTitle={title} />
    </div>
  )
}
