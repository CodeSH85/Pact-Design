import { type ReactNode } from 'react'
import {
  type DialogTriggerProps as AriaDialogTriggerProps,
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { composeTailwindRenderProps, enterExitZoomClasses } from '../../utils/index.ts'
import { Dialog, type DialogProps, DialogTrigger } from '../Dialog/index.ts'

export const popoverContentClasses = [
  'z-popover-surface min-w-popover-surface p-popover-surface-padding rounded-popover-surface',
  'bg-popover-surface-bg text-popover-surface-text border border-popover-surface-border shadow-popover-surface-shadow',
  'outline-none origin-top transition-opacity duration-fast ease-default',
  enterExitZoomClasses
].join(' ')

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
      className={composeTailwindRenderProps(className, popoverContentClasses)}
      {...props}
    >
      {(renderProps) => (
        <>
          {showArrow && (
            <AriaOverlayArrow className="fill-elevated stroke-border-default stroke-1">
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
