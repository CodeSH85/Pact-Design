import { useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from './MdxComponents.jsx'

const mdxModules = import.meta.glob('../../../../docs/spec/*.mdx', { eager: true })

const specRegistry = {}
for (const [filePath, mod] of Object.entries(mdxModules)) {
  const fileName = filePath.split('/').pop()
  const id = fileName.replace(/\.mdx$/, '')
  specRegistry[id] = {
    id,
    Content: mod.default,
    frontmatter: mod.frontmatter || {}
  }
}

export function SpecDoc({ id, showHeader = true }) {
  const entry = specRegistry[id]
  const title = entry?.frontmatter?.title || 'Pact Design'

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
    <div className="flex flex-col gap-xl">
      {showHeader && (
        <header className="flex flex-col gap-xs pb-md border-b border-border-default">
          {eyebrow && (
            <span className="text-mono-xs text-primary uppercase">{eyebrow}</span>
          )}
          <h1 className="text-heading-md text-on-surface">{title}</h1>
          {description && (
            <p className="text-subheader-sm text-on-surface-muted m-none">
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
    </div>
  )
}
