import type { ComponentPropsWithoutRef } from 'react'

export function CodeBlock({
  className = '',
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  const { backgroundColor: _bg, ...restStyle } = style ?? {}

  return (
    <pre
      className={`m-0 p-md rounded-xs border border-border-default bg-layer-1 overflow-x-auto text-mono-sm [&_code]:p-0 [&_code]:bg-transparent [&_code]:border-0 ${className}`.trim()}
      style={restStyle}
      {...props}
    >
      {children}
    </pre>
  )
}
