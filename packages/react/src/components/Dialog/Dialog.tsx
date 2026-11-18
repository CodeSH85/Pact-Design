import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps
} from 'react-aria-components'
import { RiCloseLine } from '@remixicon/react'
import {
  cn,
  composeTailwindRenderProps,
  overlayCloseButtonClasses,
  overlayFooterClasses,
  overlayHeaderClasses
} from '../../utils/index.ts'

export type DialogProps = AriaDialogProps

export function Dialog({ className, children, ...props }: DialogProps) {
  return (
    <AriaDialog
      className={cn('outline-none', className)}
      {...props}
    >
      {children}
    </AriaDialog>
  )
}

export const DialogTrigger = AriaDialogTrigger
export type DialogTriggerProps = AriaDialogTriggerProps

export interface DialogCloseButtonProps extends Omit<AriaButtonProps, 'children'> {
  children?: ReactNode | AriaButtonProps['children']
}

export function DialogCloseButton({
  'aria-label': ariaLabel = 'Close',
  className,
  children,
  ...props
}: DialogCloseButtonProps) {
  return (
    <AriaButton
      slot="close"
      aria-label={ariaLabel}
      className={composeTailwindRenderProps(className, overlayCloseButtonClasses)}
      {...props}
    >
      {children ?? <RiCloseLine className="w-icon-sm h-icon-sm" aria-hidden="true" />}
    </AriaButton>
  )
}

export interface DialogHeaderProps extends Omit<AriaHeadingProps, 'title'> {
  title?: ReactNode
  description?: ReactNode
  showCloseButton?: boolean
  className?: string
  children?: ReactNode
}

export function DialogHeader({
  title,
  description,
  showCloseButton = true,
  className,
  children,
  ...props
}: DialogHeaderProps) {
  return (
    <div className={cn(overlayHeaderClasses, className)}>
      <div className="flex flex-col gap-2xs">
        {title && (
          <AriaHeading slot="title" className="text-heading-sm font-semibold text-on-surface" {...props}>
            {title}
          </AriaHeading>
        )}
        {description && (
          <p className="text-body-sm text-on-surface-muted m-0">{description}</p>
        )}
        {children}
      </div>

      {showCloseButton && <DialogCloseButton />}
    </div>
  )
}

export interface DialogBodyProps {
  className?: string
  children?: ReactNode
}

export function DialogBody({ className, children }: DialogBodyProps) {
  return (
    <div className={cn('flex-1 min-h-0 overflow-y-auto', className)}>
      {children}
    </div>
  )
}

export interface DialogFooterProps {
  className?: string
  children?: ReactNode
}

export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <div className={cn(overlayFooterClasses, className)}>
      {children}
    </div>
  )
}

export default Dialog
