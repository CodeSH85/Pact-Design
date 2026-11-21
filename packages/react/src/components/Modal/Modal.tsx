import { type ReactNode } from 'react'
import {
  type DialogTriggerProps as AriaDialogTriggerProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  cn,
  composeTailwindRenderProps,
  enterExitFadeClasses,
  type OverlaySharedProps
} from '../../utils/index.ts'
import {
  Dialog,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps,
  type DialogProps,
  DialogTrigger
} from '../Dialog/index.ts'

export const modalOverlayClasses = [
  'fixed inset-0 z-modal-overlay bg-modal-overlay-bg flex items-center justify-center p-modal-overlay-padding',
  enterExitFadeClasses
].join(' ')

export const modalContentVariants = cva(
  [
    'w-full bg-modal-content-bg text-modal-content-text border border-modal-content-border shadow-modal-content-shadow rounded-modal-content outline-none',
    'entering:animate-in entering:zoom-in-95 exiting:animate-out exiting:zoom-out-95'
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'max-w-modal-content-sm',
        md: 'max-w-modal-content-md',
        lg: 'max-w-modal-content-lg',
        xl: 'max-w-modal-content-xl',
        full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface ModalContentProps
  extends Omit<AriaModalOverlayProps, 'children'>,
  VariantProps<typeof modalContentVariants> {
  className?: string
  overlayClassName?: string
  children?: ReactNode | AriaModalOverlayProps['children']
}

export function ModalContent({
  size = 'md',
  className,
  overlayClassName,
  isDismissable = true,
  children,
  ...props
}: ModalContentProps) {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      className={composeTailwindRenderProps(overlayClassName, modalOverlayClasses)}
      {...props}
    >
      <AriaModal className={composeTailwindRenderProps(className, modalContentVariants({ size }))}>
        {children}
      </AriaModal>
    </AriaModalOverlay>
  )
}

export interface ModalDialogProps extends DialogProps {
  children?: ReactNode
}

export function ModalDialog({ className, children, ...props }: ModalDialogProps) {
  return (
    <Dialog
      className={cn('p-modal-content-padding flex flex-col gap-modal-content-gap', className)}
      {...props}
    >
      {children}
    </Dialog>
  )
}

export interface ModalHeaderProps extends DialogHeaderProps {
  onClose?: () => void
}

export function ModalHeader({ onClose: _onClose, ...props }: ModalHeaderProps) {
  return <DialogHeader {...props} />
}

export type ModalFooterProps = DialogFooterProps

export function ModalFooter(props: ModalFooterProps) {
  return <DialogFooter {...props} />
}

export const ModalTrigger = DialogTrigger

export interface ModalProps
  extends Omit<AriaDialogTriggerProps, 'children'>,
  OverlaySharedProps {
  size?: VariantProps<typeof modalContentVariants>['size']
  children?: ReactNode
}

export function Modal({
  trigger,
  title,
  description,
  footer,
  size = 'md',
  isDismissable = true,
  children,
  ...props
}: ModalProps) {
  if (trigger) {
    return (
      <DialogTrigger {...props}>
        {trigger}
        <ModalContent size={size} isDismissable={isDismissable}>
          <ModalDialog>
            {(title || description) && (
              <ModalHeader title={title} description={description} />
            )}
            {children}
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalDialog>
        </ModalContent>
      </DialogTrigger>
    )
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

export default Modal
