import { useEffect } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter
} from '@tanstack/react-router'
import { RootLayout } from './components/layout/RootLayout.jsx'
import { SpecDoc } from './components/mdx/SpecDoc.jsx'
import { ComponentPlayground } from './components/ui/ComponentPlayground.jsx'

const rootRoute = createRootRoute({
  component: RootLayout
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    return <SpecDoc id="introduction" />
  }
})

const foundationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/foundations/$id',
  component: function FoundationPage() {
    const { id } = foundationRoute.useParams()
    return <SpecDoc id={id} />
  }
})

const componentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components',
  component: function ComponentsPage() {
    useEffect(() => {
      document.title = 'Base UI Components Playground | Pact Design'
    }, [])

    return (
      <div className="flex flex-col gap-xl">
        <header className="flex flex-col gap-xs pb-md border-b border-border-default">
          <span className="text-label-xs text-primary uppercase">Playground · React + Base UI</span>
          <h1 className="text-heading-md text-on-surface">Component Token Sandbox</h1>
          <p className="text-subheader-sm text-on-surface-muted m-none">
            Testing headless <code>@base-ui/react</code> primitives styled exclusively with Pact Design system tokens via UnoCSS.
          </p>
        </header>

        <ComponentPlayground />
      </div>
    )
  }
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  foundationRoute,
  componentsRoute
])

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL
})
