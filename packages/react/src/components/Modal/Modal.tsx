import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps
} from 'react-aria-components'
import { type OverlaySharedProps } from '../../utils/index.ts'
import {
  Dialog,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps,
  type DialogProps,
  DialogTrigger
} from '../Dialog/index.ts'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalContentProps extends Omit<AriaModalOverlayProps, 'children'> {
  size?: ModalSize
  overlayClassName?: AriaModalOverlayProps['className']
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
      className={composeRenderProps(overlayClassName, (cn) => clsx('pd-modal-overlay', cn))}
      {...props}
    >
      <AriaModal
        data-size={size}
        className={composeRenderProps(className, (cn) => clsx('pd-modal', cn))}
      >
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
      className={clsx('pd-modal-dialog', className)}
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
  size?: ModalSize
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
