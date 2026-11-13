import { type ReactNode } from 'react'
import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { cn, composeTailwindRenderProps } from '../../utils/index.ts'

export const popoverContentClasses = [
  'z-popover min-w-48 p-xs rounded-md',
  'bg-elevated text-on-surface border border-border-default shadow-elevation-lg',
  'outline-none origin-top transition-opacity duration-fast ease-default',
  'entering:animate-in entering:fade-in-0 entering:zoom-in-95',
  'exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95'
].join(' ')

export interface PopoverContentProps extends Omit<AriaPopoverProps, 'children'> {
  showArrow?: boolean
  className?: string
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

export interface PopoverDialogProps extends AriaDialogProps {
  className?: string
  children?: ReactNode
}

export function PopoverDialog({ className, children, ...props }: PopoverDialogProps) {
  return (
    <AriaDialog
      className={cn('outline-none', className)}
      {...props}
    >
      {children}
    </AriaDialog>
  )
}

export const PopoverTrigger = AriaDialogTrigger

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
      <AriaDialogTrigger {...props}>
        {trigger}
        <PopoverContent {...contentProps}>
          <PopoverDialog {...dialogProps}>
            {children}
          </PopoverDialog>
        </PopoverContent>
      </AriaDialogTrigger>
    )
  }

  return <AriaDialogTrigger {...props}>{children}</AriaDialogTrigger>
}

export default Popover
