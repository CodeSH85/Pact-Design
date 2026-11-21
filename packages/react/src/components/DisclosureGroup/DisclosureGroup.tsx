import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type Key
} from 'react-aria-components'
import { Disclosure } from '../Disclosure/Disclosure.tsx'
import { DisclosureGroupContext } from '../Disclosure/DisclosureContext.ts'

export type DisclosureGroupVariant = 'separated' | 'grouped'

export interface DisclosureGroupItemData {
  id: Key
  title: ReactNode
  content: ReactNode
  isDisabled?: boolean
}

export interface DisclosureGroupProps extends Omit<AriaDisclosureGroupProps, 'children'> {
  variant?: DisclosureGroupVariant
  items?: DisclosureGroupItemData[]
  children?: ReactNode
}

export function DisclosureGroup({
  variant = 'separated',
  items,
  className,
  children,
  ...props
}: DisclosureGroupProps) {
  const isGrouped = variant === 'grouped'

  return (
    <DisclosureGroupContext.Provider
      value={{
        variant: isGrouped ? 'ghost' : undefined,
        isGrouped
      }}
    >
      <AriaDisclosureGroup
        data-variant={variant}
        className={composeRenderProps(className, (cn) => clsx('pd-disclosure-group', cn))}
        {...props}
      >
        {items
          ? items.map((item) => (
            <Disclosure
              key={item.id}
              id={item.id}
              title={item.title}
              isDisabled={item.isDisabled}
            >
              {item.content}
            </Disclosure>
          ))
          : children}
      </AriaDisclosureGroup>
    </DisclosureGroupContext.Provider>
  )
}

export default DisclosureGroup
