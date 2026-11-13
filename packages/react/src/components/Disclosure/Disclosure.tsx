import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Heading as AriaHeading
} from 'react-aria-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps, focusRingInset } from '../../utils/index.ts'

export const disclosureVariants = cva(
  'w-full transition-colors duration-fast ease-default overflow-hidden',
  {
    variants: {
      variant: {
        bordered: 'border border-border-default rounded-sm bg-layer-1',
        ghost: 'border-b border-border-subtle bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'bordered'
    }
  }
)

export const disclosureTriggerClasses = [
  'group flex items-center justify-between w-full h-control-md px-md select-none cursor-pointer',
  'text-label-md font-medium text-on-surface bg-transparent',
  'transition-colors duration-fast ease-default',
  'hover:bg-hover active:bg-active',
  focusRingInset,
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

export const disclosurePanelClasses = [
  'px-md py-sm text-body-sm text-on-surface-secondary',
  'entering:animate-in entering:fade-in-0 exiting:animate-out exiting:fade-out-0'
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
      <AriaButton className={composeTailwindRenderProps(className, disclosureTriggerClasses)}>
        <span>{title ?? children}</span>
        <RiArrowRightSLine
          className="w-icon-xs h-icon-xs text-on-surface-muted transition-transform duration-normal ease-default group-data-[expanded]:rotate-90 shrink-0"
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
  variant = 'bordered',
  panelProps,
  className,
  children,
  ...props
}: DisclosureProps) {
  return (
    <AriaDisclosure
      className={composeTailwindRenderProps(className, disclosureVariants({ variant }))}
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

export interface DisclosureGroupProps extends AriaDisclosureGroupProps {
  className?: string
  children?: ReactNode
}

export function DisclosureGroup({ className, children, ...props }: DisclosureGroupProps) {
  return (
    <AriaDisclosureGroup
      className={composeTailwindRenderProps(className, 'flex flex-col gap-xs w-full')}
      {...props}
    >
      {children}
    </AriaDisclosureGroup>
  )
}

export default Disclosure
