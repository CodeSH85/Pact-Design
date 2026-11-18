import { type ReactNode } from 'react'
import {
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type Key
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps } from '../../utils/index.ts'
import { Disclosure } from '../Disclosure/Disclosure.tsx'
import { DisclosureGroupContext } from '../Disclosure/DisclosureContext.ts'

export const disclosureGroupVariants = cva('w-full', {
  variants: {
    variant: {
      separated: 'flex flex-col gap-disclosure-container-gap',
      grouped:
        'flex flex-col border border-disclosure-container-border rounded-disclosure-container-radius divide-y divide-disclosure-container-divider overflow-hidden bg-disclosure-container-bg'
    }
  },
  defaultVariants: {
    variant: 'separated'
  }
})

export interface DisclosureGroupItemData {
  id: Key
  title: ReactNode
  content: ReactNode
  isDisabled?: boolean
}

export interface DisclosureGroupProps
  extends AriaDisclosureGroupProps,
  VariantProps<typeof disclosureGroupVariants> {
  items?: DisclosureGroupItemData[]
  className?: string
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
        className={composeTailwindRenderProps(
          className,
          disclosureGroupVariants({ variant })
        )}
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
