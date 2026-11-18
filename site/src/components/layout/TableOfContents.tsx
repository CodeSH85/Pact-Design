import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

interface TocHeading {
  id: string
  text: string
}

export interface TableOfContentsProps {
  pageTitle?: string
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, '')
}

export function TableOfContents({ pageTitle = 'Introduction' }: TableOfContentsProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('page-overview')

  // Scan headings from the article on mount or when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const article = document.querySelector('article')
      if (!article) return

      const elements = Array.from(article.querySelectorAll('h2'))
      const extracted: TocHeading[] = elements.map((el, index) => {
        const rawText = (el.textContent ?? '').trim()
        if (!el.id) {
          el.id = slugify(rawText) || `section-${index + 1}`
        }
        return {
          id: el.id,
          text: rawText
        }
      })

      const allItems: TocHeading[] = [
        { id: 'page-overview', text: pageTitle },
        ...extracted
      ]

      setHeadings(allItems)
      setActiveId('page-overview')
    }, 60)

    return () => clearTimeout(timer)
  }, [pathname, pageTitle])

  // Track active heading as user scrolls inside <main>
  useEffect(() => {
    if (headings.length === 0) return

    const main = document.querySelector('main')
    if (!main) return

    const handleScroll = () => {
      if (main.scrollTop < 60) {
        setActiveId('page-overview')
        return
      }

      const mainRect = main.getBoundingClientRect()
      let currentActive = 'page-overview'

      for (const item of headings) {
        if (item.id === 'page-overview') continue
        const el = document.getElementById(item.id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        // If heading has passed 120px below top of main viewport
        if (rect.top - mainRect.top <= 120) {
          currentActive = item.id
        } else {
          break
        }
      }

      setActiveId(currentActive)
    }

    main.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => main.removeEventListener('scroll', handleScroll)
  }, [headings])

  const handleNavigate = (id: string) => {
    const main = document.querySelector('main')
    if (id === 'page-overview') {
      main?.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveId('page-overview')
      window.history.replaceState(null, '', pathname)
      return
    }

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  // If there are no subheadings, only overview exists, no need for TOC
  if (headings.length <= 1) {
    return null
  }

  return (
    <aside
      aria-label="Table of contents"
      className="hidden lg:block w-48 xl:w-56 shrink-0 sticky top-md self-start"
    >
      <nav className="flex flex-col border-l border-border-default">
        {headings.map((item) => {
          const isActive = activeId === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                handleNavigate(item.id)
              }}
              className={`py-xs pl-md text-label-sm transition-colors block text-left -ml-1px border-l-2 cursor-pointer ${
                isActive
                  ? 'border-primary text-on-surface font-medium'
                  : 'border-transparent text-on-surface-muted hover:text-on-surface'
              }`}
            >
              {item.text}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
