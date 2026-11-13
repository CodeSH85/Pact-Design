import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { Button } from '@pact-design/react'
import { navSections } from '../../config/navigation.js'

export function RootLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isTokenPlayground = pathname.endsWith('/playground')

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

  useEffect(() => {
    const onThemeSync = (e) => {
      const next = e.detail?.theme
      if ((next === 'light' || next === 'dark') && next !== theme) {
        setTheme(next)
      }
    }
    window.addEventListener('pact:theme-change', onThemeSync)
    return () => window.removeEventListener('pact:theme-change', onThemeSync)
  }, [theme])

  return (
    <div className="flex flex-col h-screen bg-base text-on-surface">
      <header className="flex items-center shrink-0 bg-layer-1 w-full justify-between p-md border-b border-border-default">
        <div className="flex w-full">
          <Link to="/" className="flex gap-md items-center">
            <img src={`${import.meta.env.BASE_URL}PD_logo.png`} className="size-md" alt="Pact Design" />
            <span className="text-label-lg">Pact Design</span>
          </Link>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex items-center gap-sm" role="group" aria-label="切換全站主題">
            <Button
              variant={isTokenPlayground ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => navigate({ to: isTokenPlayground ? '/' : '/playground' })}
            >
              Playground
            </Button>
            <button
              type="button"
              className="cursor-pointer"
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
        {!isTokenPlayground && (
          <aside
            className="flex flex-col min-w-12rem bg-layer-1 border-r border-border-default py-md overflow-y-auto"
            aria-label="Documentation Navigation"
          >
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col">
                <div className="px-sm py-xs bg-layer-2">{section.title}</div>
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    params={item.params}
                    activeOptions={{ exact: true }}
                    className="hover-bg-layer-1-hover hover-ring-sm hover-ring-inset hover-ring-border-strong py-2xs px-sm"
                    activeProps={{
                      className: 'active bg-layer-1-selected text-on-surface ring-sm ring-inset ring-border-strong font-medium',
                      'aria-current': 'page'
                    }}
                    inactiveProps={{
                      className: 'text-on-surface-muted'
                    }}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </aside>
        )}

        {isTokenPlayground ? (
          <main className="flex-1 min-w-0 min-h-0 overflow-hidden p-sm">
            <Outlet />
          </main>
        ) : (
          <main className="flex-1 min-w-0 overflow-y-auto p-lg">
            <div className="bg-layer-1 border-sm border-border-default py-md px-xl rounded-xs">
              <Outlet />
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
