import { useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Heading as AriaHeading
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { resolveDisableableProps, type DisableableProps } from '../../utils/index.ts'
import { Button } from '../Button/index.ts'
import { DisclosureGroupContext } from './DisclosureContext.ts'

export type DisclosureVariant = 'bordered' | 'ghost'

export interface DisclosureIcons {
  chevron?: IconSlot
}

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
  icons?: DisclosureIcons
  className?: string
  children?: ReactNode
}

export function DisclosureHeader({ title, icons, className, children }: DisclosureHeaderProps) {
  return (
    <AriaHeading className="pd-disclosure-heading">
      <Button
        slot="trigger"
        variant="ghost"
        className={composeRenderProps(className, (cn) => clsx('pd-disclosure-trigger', cn))}
      >
        <span>{title ?? children}</span>
        {renderIcon(icons?.chevron, 'chevronRight', 'pd-disclosure-chevron')}
      </Button>
    </AriaHeading>
  )
}

export interface DisclosureProps
  extends Omit<AriaDisclosureProps, 'children'>,
  DisableableProps {
  variant?: DisclosureVariant
  title?: ReactNode
  icons?: DisclosureIcons
  panelProps?: DisclosurePanelProps
  children?: ReactNode
}

export function Disclosure({
  title,
  variant,
  icons,
  panelProps,
  className,
  children,
  ...props
}: DisclosureProps) {
  const groupContext = useContext(DisclosureGroupContext)
  const resolvedVariant = variant ?? groupContext.variant ?? 'bordered'
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaDisclosure
      data-variant={resolvedVariant}
      data-grouped={groupContext.isGrouped ? '' : undefined}
      className={composeRenderProps(className, (cn) => clsx('pd-disclosure', cn))}
      {...ariaProps}
    >
      {title ? (
        <>
          <DisclosureHeader title={title} icons={icons} />
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
