import { type ReactNode } from 'react'
import {
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type Key
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisableableProps,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'
import { Disclosure, type DisclosureIcons } from '../Disclosure/Disclosure.tsx'
import { DisclosureGroupContext } from '../Disclosure/DisclosureContext.ts'

export type DisclosureGroupVariant = 'separated' | 'grouped'

export interface DisclosureGroupItemData extends DisableableProps {
  id: Key
  title: ReactNode
  content: ReactNode
}

export interface DisclosureGroupProps
  extends Omit<AriaDisclosureGroupProps, 'children'>,
  DisableableProps {
  variant?: DisclosureGroupVariant
  items?: DisclosureGroupItemData[]
  icons?: DisclosureIcons
  children?: ReactNode
}

export function DisclosureGroup({
  variant = 'separated',
  items,
  icons,
  className,
  children,
  ...props
}: DisclosureGroupProps) {
  const isGrouped = variant === 'grouped'
  const ariaProps = resolveDisableableProps(props)

  return (
    <DisclosureGroupContext.Provider
      value={{
        variant: isGrouped ? 'ghost' : undefined,
        isGrouped
      }}
    >
      <AriaDisclosureGroup
        {...dataAttrs({ variant })}
        className={pdClass(className, 'pd-disclosure-group')}
        {...ariaProps}
      >
        {items
          ? items.map((item) => (
            <Disclosure
              key={item.id}
              id={item.id}
              title={item.title}
              icons={icons}
              isDisabled={resolveDisabled(item)}
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
