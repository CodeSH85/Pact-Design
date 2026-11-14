import { type ReactNode } from 'react'
import {
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type Key
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps } from '../../utils/index.ts'
import { Disclosure } from '../Disclosure/Disclosure.tsx'

export const disclosureGroupVariants = cva('w-full', {
  variants: {
    variant: {
      separated: 'flex flex-col gap-xs',
      grouped:
        'flex flex-col border border-border-default rounded-sm divide-y divide-border-subtle overflow-hidden [&_.border]:border-0 [&_.rounded-sm]:rounded-none'
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
  return (
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
            variant={variant === 'grouped' ? 'ghost' : 'bordered'}
          >
            {item.content}
          </Disclosure>
        ))
        : children}
    </AriaDisclosureGroup>
  )
}

export default DisclosureGroup
