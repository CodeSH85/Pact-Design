import { createContext, useContext, type ReactNode } from 'react'
import {
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
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps, focusRing, focusRingInset } from '../../utils/index.ts'

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

export const tabListVariants = cva('transition-colors duration-fast', {
  variants: {
    variant: {
      underline:
        'flex border-b border-tab-list-underline-border gap-tab-list-underline-gap data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r data-[orientation=vertical]:gap-xs',
      segmented:
        'inline-flex p-tab-list-segmented-padding bg-tab-list-segmented-bg border border-tab-list-segmented-border rounded-tab-list-segmented-radius gap-tab-list-segmented-gap data-[orientation=vertical]:flex-col',
      pill: 'inline-flex gap-tab-list-pill-gap data-[orientation=vertical]:flex-col'
    },
    size: {
      sm: 'text-label-sm',
      md: 'text-label-md',
      lg: 'text-label-lg'
    }
  },
  defaultVariants: {
    variant: 'underline',
    size: 'md'
  }
})

export const tabVariants = cva(
  'flex items-center justify-center font-medium select-none cursor-pointer transition-all duration-fast outline-none data-[disabled]:text-tab-trigger-text-disabled data-[disabled]:cursor-not-allowed',
  {
    variants: {
      variant: {
        underline: [
          'relative border-b-2 -mb-px border-transparent text-tab-trigger-text hover:text-tab-trigger-text-hover',
          'data-[selected]:text-tab-trigger-text-selected data-[selected]:border-tab-trigger-border-selected',
          'data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r-2 data-[orientation=vertical]:-mr-px',
          focusRingInset
        ].join(' '),
        segmented: [
          'rounded-xs text-tab-trigger-text hover:text-tab-trigger-text-hover',
          'data-[selected]:bg-tab-trigger-segmented-bg-selected data-[selected]:text-tab-trigger-text-selected data-[selected]:shadow-tab-trigger-segmented-selected',
          focusRing
        ].join(' '),
        pill: [
          'rounded-pill text-tab-trigger-text hover:text-tab-trigger-text-hover hover:bg-tab-trigger-pill-bg-hover',
          'data-[selected]:bg-tab-trigger-pill-bg-selected data-[selected]:text-tab-trigger-pill-text-selected',
          focusRing
        ].join(' ')
      },
      size: {
        sm: 'h-tab-trigger-sm px-tab-trigger-padding-x-sm text-label-xs gap-tab-trigger-gap-sm',
        md: 'h-tab-trigger-md px-tab-trigger-padding-x-md text-label-sm gap-tab-trigger-gap-md',
        lg: 'h-tab-trigger-lg px-tab-trigger-padding-x-lg text-label-md gap-tab-trigger-gap-lg'
      }
    },
    defaultVariants: {
      variant: 'underline',
      size: 'md'
    }
  }
)

export interface TabListProps<T extends object = object>
  extends AriaTabListProps<T>,
  VariantProps<typeof tabListVariants> {
  className?: string
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
      className={composeTailwindRenderProps(
        className,
        tabListVariants({ variant: resolvedVariant, size: resolvedSize })
      )}
      {...props}
    >
      {children}
    </AriaTabList>
  )
}

export interface TabProps
  extends AriaTabProps,
  VariantProps<typeof tabVariants> {
  className?: string
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
      className={composeTailwindRenderProps(
        className,
        tabVariants({ variant: resolvedVariant, size: resolvedSize })
      )}
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
      className={cn('outline-none', className)}
      {...props}
    >
      {children}
    </AriaTabPanels>
  )
}

export const tabPanelClasses = [
  'outline-none focus:outline-none pt-md text-body-sm text-on-surface',
  'entering:animate-in entering:fade-in-0 exiting:animate-out exiting:fade-out-0'
].join(' ')

export interface TabPanelProps extends AriaTabPanelProps {
  className?: string
  children?: ReactNode
}

export function TabPanel({ className, children, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      className={composeTailwindRenderProps(className, tabPanelClasses)}
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

export interface TabsProps
  extends AriaTabsProps,
  VariantProps<typeof tabListVariants> {
  items?: TabItemData[]
  className?: string
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
    <TabContext.Provider value={{ variant: variant ?? 'underline', size: size ?? 'md' }}>
      <AriaTabs
        className={composeTailwindRenderProps(
          className,
          'flex flex-col w-full data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-md'
        )}
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
