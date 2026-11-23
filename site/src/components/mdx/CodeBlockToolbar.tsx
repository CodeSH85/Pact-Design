import type { ReactNode } from 'react'

export interface CodeBlockToolbarProps {
  language?: string
  copied: boolean
  expanded: boolean
  onCopy: () => void
  onToggleExpand: () => void
}

function ToolbarIconButton({
  label,
  active = false,
  ariaExpanded,
  onClick,
  children
}: {
  label: string
  active?: boolean
  ariaExpanded?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-label={label}
        aria-expanded={ariaExpanded}
        onClick={onClick}
        className={`flex items-center justify-center size-control-xs rounded-2xs border-0 bg-transparent cursor-pointer transition-colors ${
          active
            ? 'text-primary bg-hover'
            : 'text-on-surface-secondary hover:text-on-surface hover:bg-hover'
        }`}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-xs px-sm py-2xs rounded-2xs bg-layer-3 border border-border-default text-on-surface text-label-xs whitespace-nowrap shadow-md z-10"
      >
        {label}
      </span>
    </div>
  )
}

export function CodeBlockToolbar({
  language,
  copied,
  expanded,
  onCopy,
  onToggleExpand
}: CodeBlockToolbarProps) {
  return (
    <div className="flex items-center justify-between px-sm py-2xs bg-layer-1 rounded-t-xs">
      <span className="text-mono-xs text-on-surface-muted select-none">
        {language && language !== 'text' ? language : 'code'}
      </span>

      <div className="flex items-center gap-2xs">
        <ToolbarIconButton
          label={copied ? '已複製' : '複製程式碼'}
          active={copied}
          onClick={onCopy}
        >
          {copied ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </ToolbarIconButton>

        <ToolbarIconButton
          label={expanded ? '收合程式碼' : '展開程式碼'}
          active={expanded}
          ariaExpanded={expanded}
          onClick={onToggleExpand}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </ToolbarIconButton>
      </div>
    </div>
  )
}
