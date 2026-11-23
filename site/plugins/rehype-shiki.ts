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

type HastNode = HastRoot | HastElement | HastText | { type: string; children?: HastNode[] }

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

export function rehypeShiki() {
  return async function transform(tree: HastRoot): Promise<void> {
    const highlighter = await getHighlighter()
    const loadedLangs = new Set(highlighter.getLoadedLanguages())

    function visit(node: HastNode): void {
      if (!('children' in node) || !Array.isArray(node.children)) {
        return
      }

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (!isElement(child)) {
          visit(child)
          continue
        }

        if (child.tagName === 'pre') {
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
            if (preNode) {
              node.children[i] = preNode as HastNode
            }
            continue
          }
        }

        visit(child)
      }
    }

    visit(tree)
  }
}
