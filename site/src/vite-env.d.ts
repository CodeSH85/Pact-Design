/// <reference types="vite/client" />

declare module 'virtual:uno.css' {}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { useMDXComponents } from '@mdx-js/react'

  export interface MdxFrontmatter {
    title?: string
    eyebrow?: string
    description?: string
    [key: string]: unknown
  }

  export const frontmatter: MdxFrontmatter
  const MDXContent: ComponentType<{ components?: ReturnType<typeof useMDXComponents> }>
  export default MDXContent
}
