import { createHighlighter, type Highlighter } from 'shiki'

interface HastText {
  type: 'text'
  value: string
}

interface HastElement {
  type: 'element'
  tagName: string
  properties?: Record<string, unknown>
  children: HastNode[]
}

interface HastRoot {
  type: 'root'
  children: HastNode[]
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string
}

interface MdxJsxElement {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: HastNode[]
}

type HastNode =
  | HastRoot
  | HastElement
  | HastText
  | MdxJsxElement
  | { type: string; name?: string; value?: string; children?: HastNode[] }

const PRELOADED_LANGS = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'css',
  'html',
  'json',
  'yaml',
  'ini',
  'bash',
  'shell',
  'md',
  'mdx',
  'vue',
  'diff',
  'mermaid',
  'text'
]

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: PRELOADED_LANGS
    })
  }
  return highlighterPromise
}

function isElement(node: HastNode): node is HastElement {
  return node.type === 'element' && 'tagName' in node
}

function extractText(node: HastNode): string {
  if (node.type === 'text' && 'value' in node) {
    return node.value
  }
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }
  return ''
}

function extractLanguage(codeNode: HastElement, loadedLangs: Set<string>): string {
  const className = codeNode.properties?.className
  const classes = Array.isArray(className)
    ? className.map(String)
    : typeof className === 'string'
      ? className.split(/\s+/)
      : []

  for (const cls of classes) {
    if (cls.startsWith('language-')) {
      const lang = cls.slice('language-'.length)
      if (loadedLangs.has(lang)) {
        return lang
      }
    }
  }

  return 'text'
}

function isWhitespaceText(node: HastNode): boolean {
  return node.type === 'text' && 'value' in node && typeof node.value === 'string' && node.value.trim() === ''
}

function isComponentPreview(node: HastNode | null): boolean {
  return (
    node !== null &&
    node.type === 'mdxJsxFlowElement' &&
    'name' in node &&
    node.name === 'ComponentPreview'
  )
}

export function rehypeShiki() {
  return async function transform(tree: HastRoot): Promise<void> {
    const highlighter = await getHighlighter()
    const loadedLangs = new Set(highlighter.getLoadedLanguages())

    function visit(node: HastNode): void {
      if (!('children' in node) || !Array.isArray(node.children)) {
        return
      }

      const nextChildren: HastNode[] = []

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]

        if (isElement(child) && child.tagName === 'pre') {
          const codeNode = child.children.find(isElement)
          if (codeNode && codeNode.tagName === 'code') {
            const lang = extractLanguage(codeNode, loadedLangs)
            const rawCode = extractText(codeNode).replace(/\n$/, '')
            const hast = highlighter.codeToHast(rawCode, {
              lang,
              themes: {
                light: 'github-light',
                dark: 'github-dark'
              }
            })
            const preNode = hast.children[0]
            if (preNode && isElement(preNode)) {
              // Check if the previous non-whitespace sibling in nextChildren is <ComponentPreview>
              let prevIdx = nextChildren.length - 1
              while (prevIdx >= 0 && isWhitespaceText(nextChildren[prevIdx])) {
                prevIdx--
              }

              if (prevIdx >= 0 && isComponentPreview(nextChildren[prevIdx])) {
                const previewNode = nextChildren[prevIdx]
                preNode.properties = {
                  ...preNode.properties,
                  'data-in-demo': 'true'
                }
                const demoNode: MdxJsxElement = {
                  type: 'mdxJsxFlowElement',
                  name: 'CodeDemo',
                  attributes: [
                    { type: 'mdxJsxAttribute', name: 'code', value: rawCode },
                    { type: 'mdxJsxAttribute', name: 'language', value: lang }
                  ],
                  children: [previewNode, preNode as HastNode]
                }
                // Remove previewNode and any whitespace between previewNode and this <pre>
                nextChildren.splice(prevIdx, nextChildren.length - prevIdx, demoNode)
                continue
              }

              nextChildren.push(preNode as HastNode)
              continue
            }
          }
        }

        visit(child)
        nextChildren.push(child)
      }

      node.children = nextChildren
    }

    visit(tree)
  }
}
