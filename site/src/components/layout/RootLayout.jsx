import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

const navSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Overview', to: '/' },
      { label: 'Token Architecture', to: '/foundations/$id', params: { id: 'architecture' } }
    ]
  },
  {
    title: 'Foundations',
    items: [
      { label: 'Color', to: '/foundations/$id', params: { id: 'color' } },
      { label: 'Typography', to: '/foundations/$id', params: { id: 'typography' } },
      { label: 'Spacing', to: '/foundations/$id', params: { id: 'spacing' } },
      { label: 'Sizing', to: '/foundations/$id', params: { id: 'sizing' } },
      { label: 'Elevation', to: '/foundations/$id', params: { id: 'elevation' } },
      { label: 'Motion', to: '/foundations/$id', params: { id: 'motion' } }
    ]
  },
  {
    title: 'Components (Base UI)',
    items: [
      { label: 'Playground', to: '/components' }
    ]
  }
]

export function RootLayout() {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pact-theme', theme)
    window.dispatchEvent(new CustomEvent('pact:theme-change', { detail: { theme } }))
  }, [theme])

  return (
    <div className="flex flex-col h-screen bg-base text-on-surface">
      <header className="flex shrink-0 bg-layer-1 w-full items-center justify-between p-md border-b border-border-default">
        <div className="flex w-full">
          <Link to="/" className="">
            <span className="">P</span>
            <span>Pact Design</span>
          </Link>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex gap-sm" role="group" aria-label="切換全站主題">
            <button
              type="button"
              className="px-sm cursor-pointer"
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              ☀
            </button>
            <button
              type="button"
              className="cursor-pointer"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              ☾
            </button>
            <a
              href="https://github.com/CodeSH85/Pact-UI"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          className="flex flex-col shrink-0 bg-layer-1 border-r border-border-default py-md overflow-y-auto"
          aria-label="Documentation Navigation"
        >
          {navSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <div className="px-sm">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  params={item.params}
                  activeOptions={{ exact: true }}
                  className="hover-bg-layer-1-hover text-on-surface-muted py-2xs px-sm"
                  activeProps={{ 'aria-current': 'page' }}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto p-lg">
          <div className="bg-layer-1 py-md px-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
