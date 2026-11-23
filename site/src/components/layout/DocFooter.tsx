import { Link, useRouterState } from '@tanstack/react-router'
import { getDocSiblings, type NavItem } from '../../config/navigation'

export interface DocFooterProps {
  currentId?: string
}

function FooterNavLink({ item, direction }: { item: NavItem; direction: 'prev' | 'next' }) {
  const isPrev = direction === 'prev'
  const linkClassName = isPrev
    ? 'flex flex-col gap-2xs p-md border border-border-default hover:border-border-strong hover:bg-layer-1-hover transition-colors group cursor-pointer text-left'
    : 'flex flex-col gap-2xs p-md border border-border-default hover:border-border-strong hover:bg-layer-1-hover transition-colors group cursor-pointer text-right sm:col-start-2'

  const content = (
    <>
      <span
        className={
          isPrev
            ? 'flex items-center gap-xs text-caption-sm text-on-surface-muted group-hover:text-primary transition-colors'
            : 'flex items-center justify-end gap-xs text-caption-sm text-on-surface-muted group-hover:text-primary transition-colors'
        }
      >
        {isPrev && <span aria-hidden="true">←</span>}
        <span>{isPrev ? '上一頁' : '下一頁'}</span>
        {!isPrev && <span aria-hidden="true">→</span>}
      </span>
      <span className="text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">
        {item.title || item.label}
      </span>
    </>
  )

  if (item.to === '/foundations/$id') {
    return (
      <Link to="/foundations/$id" params={item.params} className={linkClassName}>
        {content}
      </Link>
    )
  }

  if (item.to === '/components/$id') {
    return (
      <Link to="/components/$id" params={item.params} className={linkClassName}>
        {content}
      </Link>
    )
  }

  return (
    <Link to={item.to} className={linkClassName}>
      {content}
    </Link>
  )
}

export function DocFooter({ currentId }: DocFooterProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { prev, next } = getDocSiblings(currentId || pathname)

  if (!prev && !next) {
    return null
  }

  return (
    <footer aria-label="上下頁導覽" className="pt-xl mt-xl border-t border-border-default">
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {prev ? (
          <FooterNavLink item={prev} direction="prev" />
        ) : (
          <div className="hidden sm:block" aria-hidden="true" />
        )}

        {next ? <FooterNavLink item={next} direction="next" /> : null}
      </nav>
    </footer>
  )
}
