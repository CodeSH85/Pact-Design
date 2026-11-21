import { useContext, type ReactNode } from 'react'
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Heading as AriaHeading
} from 'react-aria-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  enterExitFadeClasses,
  focusRingInset
} from '../../utils/index.ts'
import { DisclosureGroupContext } from './DisclosureContext.ts'

export const disclosureVariants = cva(
  'w-full transition-colors duration-fast ease-default overflow-hidden',
  {
    variants: {
      variant: {
        bordered: 'border border-disclosure-container-border rounded-disclosure-container-radius bg-disclosure-container-bg',
        ghost: 'border-b border-disclosure-container-divider bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'bordered'
    }
  }
)

export const disclosureTriggerClasses = [
  'group flex items-center justify-between w-full h-disclosure-trigger-height px-disclosure-trigger-padding-x rounded-disclosure-trigger-radius select-none cursor-pointer',
  'text-label-md font-medium text-disclosure-trigger-text bg-transparent',
  'transition-colors duration-fast ease-default',
  'hover:bg-disclosure-trigger-bg-hover active:bg-disclosure-trigger-bg-active',
  focusRingInset,
  'data-[disabled]:text-disclosure-trigger-text-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

export const disclosurePanelClasses = [
  'px-disclosure-panel-padding-x py-disclosure-panel-padding-y text-body-sm text-disclosure-panel-text',
  'aria-hidden:hidden',
  enterExitFadeClasses
].join(' ')

export interface DisclosurePanelProps extends Omit<AriaDisclosurePanelProps, 'children'> {
  className?: string
  children?: ReactNode
}

export function DisclosurePanel({ className, children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      className={composeTailwindRenderProps(className, disclosurePanelClasses)}
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
    <AriaHeading className="m-0">
      <AriaButton slot="trigger" className={composeTailwindRenderProps(className, disclosureTriggerClasses)}>
        <span>{title ?? children}</span>
        <RiArrowRightSLine
          className="w-icon-xs h-icon-xs text-on-surface-muted transition-transform duration-normal ease-default group-aria-expanded:rotate-90 shrink-0"
          aria-hidden="true"
        />
      </AriaButton>
    </AriaHeading>
  )
}

export interface DisclosureProps
  extends AriaDisclosureProps,
  VariantProps<typeof disclosureVariants> {
  title?: ReactNode
  panelProps?: DisclosurePanelProps
  className?: string
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
      className={composeTailwindRenderProps(
        className,
        disclosureVariants({ variant: resolvedVariant }),
        groupContext.isGrouped && 'border-b-0'
      )}
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
  disclosureGroupVariants,
  type DisclosureGroupItemData,
  type DisclosureGroupProps
} from '../DisclosureGroup/index.ts'

export default Disclosure
