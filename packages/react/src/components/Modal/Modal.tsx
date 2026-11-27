import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  type DialogTriggerProps as AriaDialogTriggerProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import { type OverlaySharedProps } from '../../utils/index.ts'
import {
  Dialog,
  DialogBody,
  type DialogBodyProps,
  DialogCloseButton,
  type DialogCloseButtonProps,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps,
  type DialogIcons,
  type DialogProps,
  DialogTrigger
} from '../../internal/Dialog/index.ts'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalIcons = DialogIcons

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
      className={pdClass(overlayClassName, 'pd-modal-overlay')}
      {...props}
    >
      <AriaModal
        {...dataAttrs({ size })}
        className={pdClass(className, 'pd-modal')}
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

export type ModalCloseButtonProps = DialogCloseButtonProps

export function ModalCloseButton(props: ModalCloseButtonProps) {
  return <DialogCloseButton {...props} />
}

export type ModalHeaderProps = DialogHeaderProps

export function ModalHeader(props: ModalHeaderProps) {
  return <DialogHeader {...props} />
}

export type ModalBodyProps = DialogBodyProps

export function ModalBody(props: ModalBodyProps) {
  return <DialogBody {...props} />
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
  icons?: ModalIcons
  children?: ReactNode
}

export function Modal({
  trigger,
  title,
  description,
  footer,
  size = 'md',
  isDismissable = true,
  icons,
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
              <ModalHeader title={title} description={description} icons={icons} />
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
