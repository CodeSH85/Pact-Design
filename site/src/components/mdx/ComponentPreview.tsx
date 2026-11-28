import type { ReactNode } from 'react'

export interface ComponentPreviewProps {
  align?: 'center' | 'start' | 'stretch'
  className?: string
  children?: ReactNode
}

export function ComponentPreview({
  align = 'center',
  className = '',
  children
}: ComponentPreviewProps) {
  const layoutClass =
    align === 'stretch'
      ? 'flex-col items-stretch'
      : align === 'start'
        ? 'flex-wrap items-center justify-start'
        : 'flex-wrap items-center justify-center'

  return (
    <div
      data-component-preview=""
      className={`flex gap-md p-lg rounded-sm bg-layer-2 border border-default ${layoutClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
