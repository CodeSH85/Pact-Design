import { useEffect } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect
} from '@tanstack/react-router'
import { RootLayout } from './components/layout/RootLayout'
import { DocFooter } from './components/layout/DocFooter'
import { SpecDoc } from './components/mdx/SpecDoc'
import { TokenPlayground } from './components/playground/TokenPlayground'
import { ComponentPlayground } from './components/playground/ComponentPlayground'

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

const principlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/principles',
  component: function PrinciplesPage() {
    return <SpecDoc id="principles" />
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

const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: TokenPlayground
})

const componentsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components',
  beforeLoad: () => {
    throw redirect({ to: '/components/playground' })
  }
})

const componentDocRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components/$id',
  component: function ComponentDocPage() {
    const { id } = componentDocRoute.useParams()
    return <SpecDoc category="components" id={id} />
  }
})

const componentPlaygroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components/playground',
  component: function ComponentPlaygroundPage() {
    useEffect(() => {
      document.title = '元件 Playground | Pact Design'
    }, [])

    return (
      <div className="flex flex-col gap-xl">
        <header className="flex flex-col gap-xs pb-md border-b border-default">
          <span className="text-mono-xs text-primary">元件</span>
          <h1 className="text-heading-xl text-fg">Playground</h1>
          <p className="text-body-md text-fg-subtle m-none">
            在單一畫面中集中檢視並實際操作 Pact Design 的所有互動元件與狀態表現。
          </p>
        </header>

        <ComponentPlayground />

        <DocFooter currentId="components-playground" />
      </div>
    )
  }
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  principlesRoute,
  foundationRoute,
  playgroundRoute,
  componentsIndexRoute,
  componentPlaygroundRoute,
  componentDocRoute
])

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
