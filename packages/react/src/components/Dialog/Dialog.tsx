import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps
} from 'react-aria-components'
import { RiCloseLine } from '@remixicon/react'

export type DialogProps = AriaDialogProps

export function Dialog({ className, children, ...props }: DialogProps) {
  return (
    <AriaDialog
      className={clsx('pd-dialog', className)}
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
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-dialog-close', cn))}
      {...props}
    >
      {children ?? <RiCloseLine className="pd-dialog-close-icon" aria-hidden="true" />}
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
    <div className={clsx('pd-dialog-header', className)}>
      <div className="pd-dialog-header-content">
        {title && (
          <AriaHeading slot="title" className="pd-dialog-title" {...props}>
            {title}
          </AriaHeading>
        )}
        {description && (
          <p className="pd-dialog-description">{description}</p>
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
    <div className={clsx('pd-dialog-body', className)}>
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
    <div className={clsx('pd-dialog-footer', className)}>
      {children}
    </div>
  )
}

export default Dialog
