import { type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastList as AriaToastList,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type QueuedToast,
  type ToastOptions,
  type ToastProps as AriaToastProps,
  type ToastRegionProps as AriaToastRegionProps
} from 'react-aria-components'
import { renderIcon, type IconSlot, type PactIconName } from '../../icons/index.ts'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import { Button } from '../Button/index.ts'

export type ToastTone = 'default' | 'info' | 'success' | 'warning' | 'danger'
export type ToastPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'

export interface ToastIcons {
  default?: IconSlot
  info?: IconSlot
  success?: IconSlot
  warning?: IconSlot
  danger?: IconSlot
  close?: IconSlot
}

export interface ToastData {
  title?: ReactNode
  description?: ReactNode
  tone?: ToastTone
  icon?: IconSlot
}

const toastToneIconNames: Record<ToastTone, PactIconName> = {
  default: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger'
}

export interface ToastProps<T extends object = ToastData> extends Omit<AriaToastProps<T>, 'children'> {
  tone?: ToastTone
  icon?: IconSlot
  icons?: ToastIcons
  children?: ReactNode
}

export function Toast<T extends object = ToastData>({
  tone = 'default',
  icon,
  icons,
  className,
  children,
  ...props
}: ToastProps<T>) {
  const toneIconSlot = icon ?? icons?.[tone]

  return (
    <AriaToast
      {...dataAttrs({ tone })}
      className={pdClass(className, 'pd-toast')}
      {...props}
    >
      {renderIcon(toneIconSlot, toastToneIconNames[tone], 'pd-toast-icon')}

      <div className="pd-toast-content">
        {children}
      </div>

      <Button
        slot="close"
        variant="ghost"
        size="xs"
        radius="2xs"
        icon
        aria-label="Close"
        className="pd-toast-close"
      >
        {renderIcon(icons?.close, 'close', 'pd-toast-close-icon')}
      </Button>
    </AriaToast>
  )
}

export interface ToastContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: ReactNode
}

export function ToastContent({ className, children, ...props }: ToastContentProps) {
  return (
    <AriaToastContent className={clsx('pd-toast-content', className)} {...props}>
      {children}
    </AriaToastContent>
  )
}

export const toastQueue = new UNSTABLE_ToastQueue<ToastData>({
  maxVisibleToasts: 5
})

export function toast(content: ToastData | string, options?: ToastOptions) {
  const data: ToastData = typeof content === 'string' ? { description: content } : content
  return toastQueue.add(data, options)
}

toast.info = (title: string, description?: string, options?: ToastOptions) =>
  toastQueue.add({ title, description, tone: 'info' }, options)

toast.success = (title: string, description?: string, options?: ToastOptions) =>
  toastQueue.add({ title, description, tone: 'success' }, options)

toast.warning = (title: string, description?: string, options?: ToastOptions) =>
  toastQueue.add({ title, description, tone: 'warning' }, options)

toast.danger = (title: string, description?: string, options?: ToastOptions) =>
  toastQueue.add({ title, description, tone: 'danger' }, options)

export interface ToastRegionProps<T extends object = ToastData>
  extends Partial<Omit<AriaToastRegionProps<T>, 'children' | 'queue'>> {
  queue?: UNSTABLE_ToastQueue<T>
  placement?: ToastPlacement
  icons?: ToastIcons
  children?: (renderProps: { toast: QueuedToast<T> }) => ReactElement
}

export function ToastRegion<T extends object = ToastData>({
  queue = toastQueue as unknown as UNSTABLE_ToastQueue<T>,
  placement = 'bottom-end',
  icons,
  className,
  children,
  ...props
}: ToastRegionProps<T>) {
  return (
    <AriaToastRegion
      queue={queue}
      {...dataAttrs({ placement })}
      className={pdClass(className, 'pd-toast-region')}
      {...props}
    >
      {children ??
        ((renderProps: { toast: QueuedToast<T> }) => {
          const toastData = renderProps.toast.content as unknown as ToastData
          return (
            <Toast
              toast={renderProps.toast}
              tone={toastData?.tone}
              icon={toastData?.icon}
              icons={icons}
            >
              {toastData?.title && (
                <h4 className="pd-toast-title">{toastData.title}</h4>
              )}
              {toastData?.description && (
                <p className="pd-toast-description">{toastData.description}</p>
              )}
            </Toast>
          )
        })}
    </AriaToastRegion>
  )
}

export { AriaToastList as ToastList }
export default Toast
