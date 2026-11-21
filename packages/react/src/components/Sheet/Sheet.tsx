import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Sheet as AriaSheet,
  SheetBackdrop as AriaSheetBackdrop,
  type SheetBackdropProps as AriaSheetBackdropProps,
  SheetContent as AriaSheetContent,
  type SheetContentProps as AriaSheetContentProps,
  SheetOverlay as AriaSheetOverlay,
  type SheetOverlayProps as AriaSheetOverlayProps,
  type SheetProps as AriaSheetProps,
  SheetTrigger as AriaSheetTrigger,
  type SheetTriggerProps as AriaSheetTriggerProps
} from 'react-aria-components'
import { type OverlaySharedProps } from '../../utils/index.ts'
import {
  DialogBody,
  type DialogBodyProps,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps
} from '../Dialog/index.ts'

export type SheetPosition = 'right' | 'left' | 'end' | 'start' | 'bottom' | 'top' | 'center'
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export const SheetTrigger = AriaSheetTrigger

export type SheetBackdropProps = AriaSheetBackdropProps

export function SheetBackdrop({ className, ...props }: SheetBackdropProps) {
  return (
    <AriaSheetBackdrop
      className={composeRenderProps(className, (cn) => clsx('pd-sheet-backdrop', cn))}
      {...props}
    />
  )
}

export interface SheetOverlayProps extends Omit<AriaSheetOverlayProps, 'children'> {
  backdropClassName?: AriaSheetBackdropProps['className']
  children?: ReactNode | AriaSheetOverlayProps['children']
}

export function SheetOverlay({
  position = 'right',
  className,
  backdropClassName,
  children,
  ...props
}: SheetOverlayProps) {
  return (
    <AriaSheetOverlay
      position={position}
      className={composeRenderProps(className, (cn) => clsx('pd-sheet-overlay', cn))}
      {...props}
    >
      {(renderProps) => (
        <>
          <SheetBackdrop className={backdropClassName} />
          {typeof children === 'function' ? children(renderProps) : children}
        </>
      )}
    </AriaSheetOverlay>
  )
}

export interface SheetPanelProps extends Omit<AriaSheetProps, 'children'> {
  position?: SheetPosition
  size?: SheetSize
  children?: ReactNode | AriaSheetProps['children']
}

export function SheetPanel({
  position = 'right',
  size = 'md',
  className,
  children,
  ...props
}: SheetPanelProps) {
  return (
    <AriaSheet
      data-position={position}
      data-size={size}
      className={composeRenderProps(className, (cn) => clsx('pd-sheet-panel', cn))}
      {...props}
    >
      {children}
    </AriaSheet>
  )
}

export interface SheetContentProps extends AriaSheetContentProps {
  className?: string
  children?: ReactNode
}

export function SheetContent({ className, children, ...props }: SheetContentProps) {
  return (
    <AriaSheetContent
      className={clsx('pd-sheet-content', className)}
      {...props}
    >
      {children}
    </AriaSheetContent>
  )
}

export type SheetHeaderProps = DialogHeaderProps

export function SheetHeader(props: SheetHeaderProps) {
  return <DialogHeader {...props} />
}

export type SheetBodyProps = DialogBodyProps

export function SheetBody(props: SheetBodyProps) {
  return <DialogBody {...props} />
}

export type SheetFooterProps = DialogFooterProps

export function SheetFooter(props: SheetFooterProps) {
  return <DialogFooter {...props} />
}

export interface SheetProps
  extends Omit<AriaSheetTriggerProps, 'children'>,
  Pick<AriaSheetOverlayProps, 'position' | 'swipeDirection' | 'snapPoints' | 'preventDismissal'>,
  OverlaySharedProps {
  size?: SheetSize
  overlayClassName?: string
  panelClassName?: string
  contentClassName?: string
  children?: ReactNode
}

export function Sheet({
  trigger,
  title,
  description,
  footer,
  position = 'right',
  swipeDirection,
  snapPoints,
  preventDismissal,
  isDismissable = true,
  size = 'md',
  overlayClassName,
  panelClassName,
  contentClassName,
  isOpen,
  defaultOpen,
  onOpenChange,
  children
}: SheetProps) {
  const resolvedPreventDismissal = preventDismissal ?? !isDismissable
  const resolvedPosition = position ?? 'right'

  const overlay = (
    <SheetOverlay
      position={resolvedPosition}
      swipeDirection={swipeDirection}
      snapPoints={snapPoints}
      preventDismissal={resolvedPreventDismissal}
      isOpen={trigger ? undefined : isOpen}
      defaultOpen={trigger ? undefined : defaultOpen}
      onOpenChange={trigger ? undefined : onOpenChange}
      className={overlayClassName}
    >
      <SheetPanel position={resolvedPosition} size={size} className={panelClassName}>
        <SheetContent className={contentClassName}>
          {(title || description) && (
            <SheetHeader title={title} description={description} />
          )}
          <SheetBody>{children}</SheetBody>
          {footer && <SheetFooter>{footer}</SheetFooter>}
        </SheetContent>
      </SheetPanel>
    </SheetOverlay>
  )

  if (trigger) {
    return (
      <AriaSheetTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {trigger}
        {overlay}
      </AriaSheetTrigger>
    )
  }

  if (isOpen !== undefined || defaultOpen !== undefined) {
    return overlay
  }

  return (
    <AriaSheetTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </AriaSheetTrigger>
  )
}

export type {
  AriaSheetBackdropProps as RawSheetBackdropProps,
  AriaSheetContentProps as RawSheetContentProps,
  AriaSheetOverlayProps as RawSheetOverlayProps,
  AriaSheetProps as RawSheetProps,
  AriaSheetTriggerProps as SheetTriggerProps
}
export default Sheet
