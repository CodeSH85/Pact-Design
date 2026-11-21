import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { Dialog, type DialogProps, DialogTrigger } from '../Dialog/index.ts'

export interface PopoverContentProps extends Omit<AriaPopoverProps, 'children'> {
  showArrow?: boolean
  children?: ReactNode | AriaPopoverProps['children']
}

export function PopoverContent({
  offset = 6,
  showArrow = false,
  className,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <AriaPopover
      offset={offset}
      className={composeRenderProps(className, (cn) => clsx('pd-popover', cn))}
      {...props}
    >
      {(renderProps) => (
        <>
          {showArrow && (
            <AriaOverlayArrow className="pd-popover-arrow">
              <svg width={12} height={12} viewBox="0 0 12 12">
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </AriaOverlayArrow>
          )}
          {typeof children === 'function' ? children(renderProps) : children}
        </>
      )}
    </AriaPopover>
  )
}

export interface PopoverDialogProps extends DialogProps {
  children?: ReactNode
}

export function PopoverDialog({ children, ...props }: PopoverDialogProps) {
  return <Dialog {...props}>{children}</Dialog>
}

export const PopoverTrigger = DialogTrigger

export interface PopoverProps extends Omit<AriaDialogTriggerProps, 'children'> {
  trigger?: ReactNode
  contentProps?: Omit<PopoverContentProps, 'children'>
  dialogProps?: PopoverDialogProps
  children?: ReactNode
}

export function Popover({
  trigger,
  contentProps,
  dialogProps,
  children,
  ...props
}: PopoverProps) {
  if (trigger) {
    return (
      <DialogTrigger {...props}>
        {trigger}
        <PopoverContent {...contentProps}>
          <PopoverDialog {...dialogProps}>
            {children}
          </PopoverDialog>
        </PopoverContent>
      </DialogTrigger>
    )
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

export default Popover
