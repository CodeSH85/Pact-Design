import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
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
import { dataAttrs, pdClass } from '../../internal/index.ts'
import { type OverlaySharedProps } from '../../utils/index.ts'
import {
  DialogBody,
  type DialogBodyProps,
  DialogCloseButton,
  type DialogCloseButtonProps,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps,
  type DialogIcons
} from '../../internal/Dialog/index.ts'

export type SheetPosition = 'right' | 'left' | 'end' | 'start' | 'bottom' | 'top' | 'center'
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type SheetIcons = DialogIcons

export const SheetTrigger = AriaSheetTrigger

export type SheetBackdropProps = AriaSheetBackdropProps

export function SheetBackdrop({
  swipeAnimation = 'pd-fade-in',
  className,
  ...props
}: SheetBackdropProps) {
  return (
    <AriaSheetBackdrop
      swipeAnimation={swipeAnimation}
      className={pdClass(className, 'pd-sheet-backdrop')}
      {...props}
    />
  )
}

export interface SheetOverlayProps extends Omit<AriaSheetOverlayProps, 'children'> {
  backdropClassName?: AriaSheetBackdropProps['className']
  backdropProps?: SheetBackdropProps
  children?: ReactNode | AriaSheetOverlayProps['children']
}

export function SheetOverlay({
  position = 'right',
  snapPoints,
  className,
  backdropClassName,
  backdropProps,
  children,
  ...props
}: SheetOverlayProps) {
  const defaultBackdropRange = snapPoints?.length
    ? { start: snapPoints.length - 1 }
    : undefined

  return (
    <AriaSheetOverlay
      position={position}
      snapPoints={snapPoints}
      className={pdClass(className, 'pd-sheet-overlay')}
      {...props}
    >
      {(renderProps) => (
        <>
          <SheetBackdrop
            swipeAnimationRange={defaultBackdropRange}
            {...backdropProps}
            className={backdropClassName ?? backdropProps?.className}
          />
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
      {...dataAttrs({ position, size })}
      className={pdClass(className, 'pd-sheet-panel')}
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

export type SheetCloseButtonProps = DialogCloseButtonProps

export function SheetCloseButton(props: SheetCloseButtonProps) {
  return <DialogCloseButton {...props} />
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
  Pick<AriaSheetProps, 'swipeAnimation' | 'swipeAnimationRange' | 'stackAnimation' | 'overscrollPadding'>,
  OverlaySharedProps {
  size?: SheetSize
  icons?: SheetIcons
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
  swipeAnimation,
  swipeAnimationRange,
  stackAnimation,
  overscrollPadding,
  isDismissable = true,
  size = 'md',
  icons,
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
      <SheetPanel
        position={resolvedPosition}
        size={size}
        swipeAnimation={swipeAnimation}
        swipeAnimationRange={swipeAnimationRange}
        stackAnimation={stackAnimation}
        overscrollPadding={overscrollPadding}
        className={panelClassName}
      >
        <SheetContent className={contentClassName}>
          {(title || description) && (
            <SheetHeader title={title} description={description} icons={icons} />
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
