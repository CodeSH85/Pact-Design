import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps
} from 'react-aria-components'
import {
  Button,
  type ButtonActionProps,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant
} from '../../components/Button/index.ts'
import { renderIcon, type IconSlot } from '../../icons/index.ts'

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

export interface DialogIcons {
  close?: IconSlot
}

export interface DialogCloseButtonProps
  extends Omit<ButtonActionProps, 'variant' | 'size' | 'radius' | 'icon'> {
  variant?: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  icon?: boolean
  icons?: DialogIcons
}

export function DialogCloseButton({
  'aria-label': ariaLabel = 'Close',
  variant = 'ghost',
  size = 'xs',
  radius = 'xs',
  icon = true,
  icons,
  className,
  children,
  ...props
}: DialogCloseButtonProps) {
  return (
    <Button
      slot="close"
      variant={variant}
      size={size}
      radius={radius}
      icon={icon}
      aria-label={ariaLabel}
      className={composeRenderProps(className, (cn) => clsx('pd-dialog-close', cn))}
      {...props}
    >
      {children ?? renderIcon(icons?.close, 'close', 'pd-dialog-close-icon')}
    </Button>
  )
}

export interface DialogHeaderProps extends Omit<AriaHeadingProps, 'title'> {
  title?: ReactNode
  description?: ReactNode
  showCloseButton?: boolean
  icons?: DialogIcons
  className?: string
  children?: ReactNode
}

export function DialogHeader({
  title,
  description,
  showCloseButton = true,
  icons,
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

      {showCloseButton && <DialogCloseButton icons={icons} />}
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
