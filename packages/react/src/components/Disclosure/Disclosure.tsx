import { useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  composeRenderProps,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Heading as AriaHeading
} from 'react-aria-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { DisclosureGroupContext } from './DisclosureContext.ts'

export type DisclosureVariant = 'bordered' | 'ghost'

export interface DisclosurePanelProps extends Omit<AriaDisclosurePanelProps, 'children'> {
  children?: ReactNode
}

export function DisclosurePanel({ className, children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      className={composeRenderProps(className, (cn) => clsx('pd-disclosure-panel', cn))}
      {...props}
    >
      {children}
    </AriaDisclosurePanel>
  )
}

export interface DisclosureHeaderProps {
  title?: ReactNode
  className?: string
  children?: ReactNode
}

export function DisclosureHeader({ title, className, children }: DisclosureHeaderProps) {
  return (
    <AriaHeading className="pd-disclosure-heading">
      <AriaButton
        slot="trigger"
        className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-disclosure-trigger', cn))}
      >
        <span>{title ?? children}</span>
        <RiArrowRightSLine className="pd-disclosure-chevron" aria-hidden="true" />
      </AriaButton>
    </AriaHeading>
  )
}

export interface DisclosureProps extends Omit<AriaDisclosureProps, 'children'> {
  variant?: DisclosureVariant
  title?: ReactNode
  panelProps?: DisclosurePanelProps
  children?: ReactNode
}

export function Disclosure({
  title,
  variant,
  panelProps,
  className,
  children,
  ...props
}: DisclosureProps) {
  const groupContext = useContext(DisclosureGroupContext)
  const resolvedVariant = variant ?? groupContext.variant ?? 'bordered'

  return (
    <AriaDisclosure
      data-variant={resolvedVariant}
      data-grouped={groupContext.isGrouped ? '' : undefined}
      className={composeRenderProps(className, (cn) => clsx('pd-disclosure', cn))}
      {...props}
    >
      {title ? (
        <>
          <DisclosureHeader title={title} />
          <DisclosurePanel {...panelProps}>
            {children}
          </DisclosurePanel>
        </>
      ) : (
        children
      )}
    </AriaDisclosure>
  )
}

export {
  DisclosureGroup,
  type DisclosureGroupItemData,
  type DisclosureGroupProps,
  type DisclosureGroupVariant
} from '../DisclosureGroup/index.ts'

export default Disclosure
