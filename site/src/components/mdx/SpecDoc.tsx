import { useEffect, type ComponentType } from 'react'
import { MDXProvider, type useMDXComponents } from '@mdx-js/react'
import { mdxComponents } from './MdxComponents'
import { DocFooter } from '../layout/DocFooter'
import { TableOfContents } from '../layout/TableOfContents'

export type DocCategory = 'spec' | 'components'

interface SpecFrontmatter {
  title?: string
  eyebrow?: string
  description?: string
}

interface MdxSpecModule {
  default: ComponentType<{ components?: ReturnType<typeof useMDXComponents> }>
  frontmatter?: SpecFrontmatter
}

interface SpecRegistryEntry {
  id: string
  Content: MdxSpecModule['default']
  frontmatter: SpecFrontmatter
}

export interface SpecDocProps {
  id: string
  category?: DocCategory
  showHeader?: boolean
}

const specModules = import.meta.glob<MdxSpecModule>('../../../../docs/spec/*.mdx', { eager: true })
const componentModules = import.meta.glob<MdxSpecModule>('../../../../docs/components/*.mdx', { eager: true })

function buildRegistry(modules: Record<string, MdxSpecModule>): Record<string, SpecRegistryEntry> {
  const registry: Record<string, SpecRegistryEntry> = {}
  for (const [filePath, mod] of Object.entries(modules)) {
    const fileName = filePath.split('/').pop()
    if (!fileName) continue
    const id = fileName.replace(/\.mdx$/, '')
    registry[id] = {
      id,
      Content: mod.default,
      frontmatter: mod.frontmatter ?? {}
    }
  }
  return registry
}

const registries: Record<DocCategory, Record<string, SpecRegistryEntry>> = {
  spec: buildRegistry(specModules),
  components: buildRegistry(componentModules)
}

export function SpecDoc({ id, category = 'spec', showHeader = true }: SpecDocProps) {
  const entry = registries[category][id]
  const title = entry?.frontmatter.title || 'Pact Design'

  useEffect(() => {
    document.title = title === 'Pact Design'
      ? 'Pact Design · Design System'
      : `${title} | Pact Design`
  }, [title])

  if (!entry) {
    return (
      <div className="p-md bg-danger-subtle text-on-danger-subtle border border-danger-border rounded-xs text-body-sm">
        Doc markdown entry &ldquo;{id}&rdquo; not found in <code>docs/{category}/{id}.mdx</code>
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
