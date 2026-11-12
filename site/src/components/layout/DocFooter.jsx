import { Link, useRouterState } from '@tanstack/react-router'
import { getDocSiblings } from '../../config/navigation.js'

export function DocFooter({ currentId }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { prev, next } = getDocSiblings(currentId || pathname)

  if (!prev && !next) {
    return null
  }

  return (
    <footer aria-label="Doc Navigation" className="pt-xl mt-xl border-t border-border-default">
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {prev ? (
          <Link
            to={prev.to}
            params={prev.params}
            className="flex flex-col gap-2xs p-md border border-border-default hover:border-border-strong hover:bg-layer-1-hover transition-colors group cursor-pointer text-left"
          >
            <span className="flex items-center gap-xs text-caption-sm text-on-surface-muted group-hover:text-primary transition-colors">
              <span aria-hidden="true">←</span>
              <span>Previous</span>
            </span>
            <span className="text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">
              {prev.title || prev.label}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" aria-hidden="true" />
        )}

        {next ? (
          <Link
            to={next.to}
            params={next.params}
            className="flex flex-col gap-2xs p-md border border-border-default hover:border-border-strong hover:bg-layer-1-hover transition-colors group cursor-pointer text-right sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-xs text-caption-sm text-on-surface-muted group-hover:text-primary transition-colors">
              <span>Next</span>
              <span aria-hidden="true">→</span>
            </span>
            <span className="text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">
              {next.title || next.label}
            </span>
          </Link>
        ) : null}
      </nav>
    </footer>
  )
}
