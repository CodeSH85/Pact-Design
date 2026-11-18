import { type ReactNode } from 'react'
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
import { cva, type VariantProps } from 'class-variance-authority'
import {
  cn,
  composeTailwindRenderProps,
  enterExitFadeClasses,
  type OverlaySharedProps
} from '../../utils/index.ts'
import {
  DialogBody,
  type DialogBodyProps,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps
} from '../Dialog/index.ts'

export const sheetBackdropClasses = [
  'bg-modal-overlay-bg',
  enterExitFadeClasses
].join(' ')

export const sheetPanelVariants = cva(
  'bg-modal-content-bg text-modal-content-text border-modal-content-border shadow-modal-content-shadow outline-none flex flex-col overflow-hidden',
  {
    variants: {
      position: {
        right: 'h-full w-full border-l rounded-l-md',
        left: 'h-full w-full border-r rounded-r-md',
        end: 'h-full w-full border-l rounded-l-md',
        start: 'h-full w-full border-r rounded-r-md',
        bottom: 'w-full max-h-[85dvh] border-t rounded-t-md',
        top: 'w-full max-h-[85dvh] border-b rounded-b-md',
        center: 'w-full max-h-[90dvh] border rounded-md'
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
        full: ''
      }
    },
    compoundVariants: [
      { position: ['left', 'right', 'start', 'end', 'center'], size: 'sm', className: 'max-w-modal-content-sm' },
      { position: ['left', 'right', 'start', 'end', 'center'], size: 'md', className: 'max-w-modal-content-md' },
      { position: ['left', 'right', 'start', 'end', 'center'], size: 'lg', className: 'max-w-modal-content-lg' },
      { position: ['left', 'right', 'start', 'end', 'center'], size: 'xl', className: 'max-w-modal-content-xl' },
      { position: ['left', 'right', 'start', 'end', 'center'], size: 'full', className: 'max-w-full' },
      { position: ['top', 'bottom'], size: 'sm', className: 'max-h-[35dvh]' },
      { position: ['top', 'bottom'], size: 'md', className: 'max-h-[55dvh]' },
      { position: ['top', 'bottom'], size: 'lg', className: 'max-h-[75dvh]' },
      { position: ['top', 'bottom'], size: 'xl', className: 'max-h-[90dvh]' },
      { position: ['top', 'bottom'], size: 'full', className: 'h-full max-h-full rounded-none' }
    ],
    defaultVariants: {
      position: 'right',
      size: 'md'
    }
  }
)

export const SheetTrigger = AriaSheetTrigger

export interface SheetBackdropProps extends AriaSheetBackdropProps {
  className?: string
}

export function SheetBackdrop({ className, ...props }: SheetBackdropProps) {
  return (
    <AriaSheetBackdrop
      className={composeTailwindRenderProps(className, sheetBackdropClasses)}
      {...props}
    />
  )
}

export interface SheetOverlayProps extends AriaSheetOverlayProps {
  className?: string
  backdropClassName?: string
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
      className={composeTailwindRenderProps(className, 'z-drawer')}
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

export interface SheetPanelProps
  extends AriaSheetProps,
  VariantProps<typeof sheetPanelVariants> {
  className?: string
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
      className={composeTailwindRenderProps(className, sheetPanelVariants({ position, size }))}
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
      className={cn('outline-none p-lg flex flex-col gap-md flex-1 min-h-0 overflow-hidden', className)}
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
  Omit<VariantProps<typeof sheetPanelVariants>, 'position'>,
  OverlaySharedProps {
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
