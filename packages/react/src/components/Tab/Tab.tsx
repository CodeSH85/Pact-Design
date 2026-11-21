import { createContext, useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
  type Key,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabPanelsProps as AriaTabPanelsProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps
} from 'react-aria-components'

export type TabVariant = 'underline' | 'segmented' | 'pill'
export type TabSize = 'sm' | 'md' | 'lg'

interface TabContextValue {
  variant: TabVariant
  size: TabSize
}

const TabContext = createContext<TabContextValue>({
  variant: 'underline',
  size: 'md'
})

export interface TabListProps<T extends object = object> extends AriaTabListProps<T> {
  variant?: TabVariant
  size?: TabSize
  children?: ReactNode | AriaTabListProps<T>['children']
}

export function TabList<T extends object = object>({
  variant,
  size,
  className,
  children,
  ...props
}: TabListProps<T>) {
  const context = useContext(TabContext)
  const resolvedVariant = variant ?? context.variant
  const resolvedSize = size ?? context.size

  return (
    <AriaTabList
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={composeRenderProps(className, (cn) => clsx('pd-tab-list', cn))}
      {...props}
    >
      {children}
    </AriaTabList>
  )
}

export interface TabProps extends Omit<AriaTabProps, 'children'> {
  variant?: TabVariant
  size?: TabSize
  children?: ReactNode | AriaTabProps['children']
}

export function Tab({
  variant,
  size,
  className,
  children,
  ...props
}: TabProps) {
  const context = useContext(TabContext)
  const resolvedVariant = variant ?? context.variant
  const resolvedSize = size ?? context.size

  return (
    <AriaTab
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={composeRenderProps(className, (cn) => clsx('pd-tab', cn))}
      {...props}
    >
      {children}
    </AriaTab>
  )
}

export interface TabPanelsProps<T extends object = object> extends AriaTabPanelsProps<T> {
  className?: string
  children?: ReactNode
}

export function TabPanels<T extends object = object>({
  className,
  children,
  ...props
}: TabPanelsProps<T>) {
  return (
    <AriaTabPanels
      className={clsx('pd-tab-panels', className)}
      {...props}
    >
      {children}
    </AriaTabPanels>
  )
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, 'children'> {
  children?: ReactNode
}

export function TabPanel({ className, children, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      className={composeRenderProps(className, (cn) => clsx('pd-tab-panel', cn))}
      {...props}
    >
      {children}
    </AriaTabPanel>
  )
}

export interface TabItemData {
  id: Key
  label: ReactNode
  content: ReactNode
  isDisabled?: boolean
}

export interface TabsProps extends Omit<AriaTabsProps, 'children'> {
  variant?: TabVariant
  size?: TabSize
  items?: TabItemData[]
  children?: ReactNode
}

export function Tabs({
  variant = 'underline',
  size = 'md',
  items,
  className,
  children,
  ...props
}: TabsProps) {
  return (
    <TabContext.Provider value={{ variant, size }}>
      <AriaTabs
        className={composeRenderProps(className, (cn) => clsx('pd-tabs', cn))}
        {...props}
      >
        {items ? (
          <>
            <TabList>
              {items.map((item) => (
                <Tab key={item.id} id={item.id} isDisabled={item.isDisabled}>
                  {item.label}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {items.map((item) => (
                <TabPanel key={item.id} id={item.id}>
                  {item.content}
                </TabPanel>
              ))}
            </TabPanels>
          </>
        ) : (
          children
        )}
      </AriaTabs>
    </TabContext.Provider>
  )
}

export default Tabs
