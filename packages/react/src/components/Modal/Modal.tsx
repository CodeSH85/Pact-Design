import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps
} from 'react-aria-components'
import { RiCloseLine } from '@remixicon/react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  cn,
  composeTailwindRenderProps,
  enterExitFadeClasses,
  overlayCloseButtonClasses,
  overlayFooterClasses,
  overlayHeaderClasses,
  type OverlaySharedProps
} from '../../utils/index.ts'

export const modalOverlayClasses = [
  'fixed inset-0 z-modal bg-modal-overlay-bg flex items-center justify-center p-modal-overlay-padding',
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

export interface ModalDialogProps extends AriaDialogProps {
  className?: string
  children?: ReactNode
}

export function ModalDialog({ className, children, ...props }: ModalDialogProps) {
  return (
    <AriaDialog
      className={cn('outline-none p-lg flex flex-col gap-md', className)}
      {...props}
    >
      {children}
    </AriaDialog>
  )
}

export interface ModalHeaderProps extends Omit<AriaHeadingProps, 'title'> {
  title?: ReactNode
  description?: ReactNode
  showCloseButton?: boolean
  onClose?: () => void
  className?: string
  children?: ReactNode
}

export function ModalHeader({
  title,
  description,
  showCloseButton = true,
  className,
  children,
  ...props
}: ModalHeaderProps) {
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

      {showCloseButton && (
        <AriaButton
          slot="close"
          className={overlayCloseButtonClasses}
          aria-label="Close"
        >
          <RiCloseLine className="w-icon-sm h-icon-sm" aria-hidden="true" />
        </AriaButton>
      )}
    </div>
  )
}

export interface ModalFooterProps {
  className?: string
  children?: ReactNode
}

export function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div className={cn(overlayFooterClasses, className)}>
      {children}
    </div>
  )
}

export const ModalTrigger = AriaDialogTrigger

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
      <AriaDialogTrigger {...props}>
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
      </AriaDialogTrigger>
    )
  }

  return <AriaDialogTrigger {...props}>{children}</AriaDialogTrigger>
}

export default Modal
