import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  Button,
  Disclosure,
  DisclosureGroup,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  ToastRegion,
  Tooltip,
  TooltipTrigger
} from '@pact-design/react'
import {
  RiComputerLine,
  RiGithubFill,
  RiMoonLine,
  RiSunLine
} from '@remixicon/react'
import { navSections, type NavItem } from '../../config/navigation'
import type { ThemeMode } from '../../types/tokens'
import { ThemeCustomizer } from './ThemeCustomizer'

type ThemePreference = ThemeMode | 'system'

const THEME_OPTIONS: ReadonlyArray<{
  id: ThemePreference
  label: string
  icon: typeof RiSunLine
}> = [
  { id: 'light', label: '淺色 Light', icon: RiSunLine },
  { id: 'dark', label: '深色 Dark', icon: RiMoonLine },
  { id: 'system', label: '跟隨系統 System', icon: RiComputerLine }
]

const SHARED_NAV_LINK_PROPS = {
  activeOptions: { exact: true },
  className: 'hover-bg-layer-1-hover py-2xs px-md text-body-sm rounded-xs focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus focus-visible:-outline-offset-2',
  activeProps: {
    className: 'bg-layer-1-selected hover-bg-layer-1-selected-hover ring-sm ring-inset ring-default text-fg font-medium',
    'aria-current': 'page' as const
  },
  inactiveProps: {
    className: 'text-fg-default'
  }
}

function SideNavLink({ item }: { item: NavItem }) {
  if (item.to === '/foundations/$id') {
    return (
      <Link to="/foundations/$id" params={item.params} {...SHARED_NAV_LINK_PROPS}>
        <span>{item.label}</span>
      </Link>
    )
  }

  if (item.to === '/components/$id') {
    return (
      <Link to="/components/$id" params={item.params} {...SHARED_NAV_LINK_PROPS}>
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <Link to={item.to} {...SHARED_NAV_LINK_PROPS}>
      <span>{item.label}</span>
    </Link>
  )
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function RootLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname
  const isTokenPlayground = routePath === '/playground' || routePath === '/playground/'

  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pact-theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved
      }
    }
    return 'system'
  })
  const [systemDark, setSystemDark] = useState<boolean>(getSystemDark)

  const resolvedTheme: ThemeMode = themePreference === 'system'
    ? (systemDark ? 'dark' : 'light')
    : themePreference

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    localStorage.setItem('pact-theme', themePreference)
    window.dispatchEvent(new CustomEvent<{ theme: ThemeMode }>('pact:theme-change', { detail: { theme: resolvedTheme } }))
  }, [themePreference, resolvedTheme])

  useEffect(() => {
    const onThemeSync = (e: Event) => {
      const next = (e as CustomEvent<{ theme?: ThemeMode }>).detail?.theme
      if ((next === 'light' || next === 'dark') && next !== resolvedTheme) {
        setThemePreference(next)
      }
    }
    window.addEventListener('pact:theme-change', onThemeSync)
    return () => window.removeEventListener('pact:theme-change', onThemeSync)
  }, [resolvedTheme])

  const ActiveThemeIcon = THEME_OPTIONS.find((opt) => opt.id === themePreference)?.icon ?? RiComputerLine
  const logoSrc = `${import.meta.env.BASE_URL}${resolvedTheme === 'dark' ? 'PD_Logo_text_dark.png' : 'PD_Logo_text_light.png'}`

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base text-fg">
      <header className="flex items-center shrink-0 bg-layer-1 w-full justify-between py-sm px-xl border-b border-default">
        <div className="flex w-full">
          <Link to="/" className="flex items-center">
            <img
              src={logoSrc}
              width={268}
              height={47}
              className="h-md w-auto block"
              alt="Pact Design"
            />
          </Link>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex items-center gap-xs">
            <Button
              variant={isTokenPlayground ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => navigate({ to: isTokenPlayground ? '/' : '/playground' })}
            >
              Playground
            </Button>

            <ThemeCustomizer />

            <Menu
              trigger={(
                <Button variant="ghost" size="sm" icon aria-label="切換全站主題">
                  <ActiveThemeIcon />
                </Button>
              )}
            >
              <MenuPopover placement="bottom end">
                <MenuList
                  aria-label="主題模式"
                  selectionMode="single"
                  selectedKeys={new Set([themePreference])}
                  onSelectionChange={(keys) => {
                    const next = [...keys][0]
                    if (next === 'light' || next === 'dark' || next === 'system') {
                      setThemePreference(next)
                    }
                  }}
                >
                  {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
                    <MenuItem key={id} id={id} icon={<Icon />}>
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>

            <TooltipTrigger>
              <Button
                href="https://github.com/CodeSH85/Pact-UI"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                icon
                aria-label="GitHub"
              >
                <RiGithubFill />
              </Button>
              <Tooltip>GitHub</Tooltip>
            </TooltipTrigger>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isTokenPlayground && (
          <aside
            className="flex flex-col w-16rem shrink-0 px-sm py-xs bg-layer-1 border-r border-default overflow-y-auto [scrollbar-gutter:stable]"
            aria-label="文件導覽"
          >
            <DisclosureGroup
              allowsMultipleExpanded
              defaultExpandedKeys={navSections.map((section) => section.title)}
              className="gap-0 shrink-0"
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
                    {section.items.map((item) => (
                      <SideNavLink key={item.id} item={item} />
                    ))}
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
            <div className="bg-layer-1 border-sm border-default py-md px-xl rounded-xs">
              <Outlet />
            </div>
          </main>
        )}
      </div>

      <ToastRegion placement="top" />
    </div>
  )
}
