import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { CodeBlockToolbar } from './CodeBlockToolbar'

export interface CodeDemoProps {
  code?: string
  language?: string
  children?: ReactNode
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback below
    }
  }

  if (typeof document === 'undefined') return false

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

export function CodeDemo({ code = '', language, children }: CodeDemoProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const items = Children.toArray(children)
  const preview = items[0]
  const codeBlock = items[1]

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopy() {
    if (!code) return
    const ok = await copyText(code)
    if (!ok) return
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="rounded-sm bg-layer-2 overflow-visible [&_[data-component-preview]]:border-0 [&_[data-component-preview]]:rounded-none">
      <div className="rounded-t-sm overflow-visible">
        <CodeBlockToolbar
          language={language}
          copied={copied}
          expanded={expanded}
          onCopy={handleCopy}
          onToggleExpand={() => setExpanded((prev) => !prev)}
        />
      </div>
      <div className="border border-border-default">
        {preview}

        {expanded && codeBlock && (
          <div className="border-t border-border-default rounded-b-sm overflow-hidden">
            {codeBlock}
          </div>
        )}
      </div>
    </div>
  )
}
