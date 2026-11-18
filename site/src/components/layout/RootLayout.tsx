import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  Button,
  Disclosure,
  DisclosureGroup,
  ToastRegion,
  ToggleButton,
  ToggleButtonGroup
} from '@pact-design/react'
import { navSections } from '../../config/navigation'
import type { ThemeMode } from '../../types/tokens'

export function RootLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isTokenPlayground = pathname.endsWith('/playground')

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme')
      return attr === 'dark' ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pact-theme', theme)
    window.dispatchEvent(new CustomEvent<{ theme: ThemeMode }>('pact:theme-change', { detail: { theme } }))
  }, [theme])

  useEffect(() => {
    const onThemeSync = (e: Event) => {
      const next = (e as CustomEvent<{ theme?: ThemeMode }>).detail?.theme
      if ((next === 'light' || next === 'dark') && next !== theme) {
        setTheme(next)
      }
    }
    window.addEventListener('pact:theme-change', onThemeSync)
    return () => window.removeEventListener('pact:theme-change', onThemeSync)
  }, [theme])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base text-on-surface">
      <header className="flex items-center shrink-0 bg-layer-1 w-full justify-between p-sm border-b border-border-default">
        <div className="flex w-full">
          <Link to="/" className="flex gap-md items-center">
            <img src={`${import.meta.env.BASE_URL}PD_logo.png`} className="size-md" alt="Pact Design" />
            <span className="text-label-lg">Pact Design</span>
          </Link>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex items-center gap-sm">
            <Button
              variant={isTokenPlayground ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => navigate({ to: isTokenPlayground ? '/' : '/playground' })}
            >
              Playground
            </Button>
            <ToggleButtonGroup
              aria-label="切換全站主題"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={new Set([theme])}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                if (next === 'light' || next === 'dark') {
                  setTheme(next)
                }
              }}
            >
              <ToggleButton id="light" size="sm" variant="secondary" aria-label="淺色主題">
                ☀
              </ToggleButton>
              <ToggleButton id="dark" size="sm" variant="secondary" aria-label="深色主題">
                ☾
              </ToggleButton>
            </ToggleButtonGroup>
            <a
              href="https://github.com/CodeSH85/Pact-UI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-sm text-on-surface-secondary hover:text-on-surface"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isTokenPlayground && (
          <aside
            className="flex flex-col min-w-12rem bg-layer-1 border-r border-border-default overflow-y-auto"
            aria-label="Documentation Navigation"
          >
            <DisclosureGroup
              allowsMultipleExpanded
              defaultExpandedKeys={navSections.map((section) => section.title)}
              className="gap-0"
            >
              {navSections.map((section) => (
                <Disclosure
                  key={section.title}
                  id={section.title}
                  title={section.title}
                  variant="ghost"
                  panelProps={{ className: 'p-0' }}
                >
                  <div className="flex flex-col">
                    {section.items.map((item) => {
                      const sharedLinkProps = {
                        activeOptions: { exact: true },
                        className: 'hover-bg-layer-1-hover py-2xs px-md text-body-sm',
                        activeProps: {
                          className: 'bg-layer-1-selected hover-bg-layer-1-selected-hover ring-sm ring-inset ring-border-default text-on-surface font-medium',
                          'aria-current': 'page' as const
                        },
                        inactiveProps: {
                          className: 'text-on-surface-default'
                        }
                      }
                      return item.to === '/foundations/$id' ? (
                        <Link
                          key={item.label}
                          to={item.to}
                          params={item.params}
                          {...sharedLinkProps}
                        >
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.to}
                          {...sharedLinkProps}
                        >
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </Disclosure>
              ))}
            </DisclosureGroup>
          </aside>
        )}

        {isTokenPlayground ? (
          <main className="relative flex-1 min-w-0 min-h-0 overflow-hidden p-sm">
            <Outlet />
          </main>
        ) : (
          <main className="relative flex-1 min-w-0 overflow-y-auto p-lg">
            <div className="bg-layer-1 border-sm border-border-default py-md px-xl rounded-xs">
              <Outlet />
            </div>
          </main>
        )}
      </div>

      <ToastRegion />
    </div>
  )
}
