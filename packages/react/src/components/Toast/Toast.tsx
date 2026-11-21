import { type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  composeRenderProps,
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
import {
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiInformationLine
} from '@remixicon/react'

export type ToastTone = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface ToastData {
  title?: ReactNode
  description?: ReactNode
  tone?: ToastTone
}

const toastToneIcons: Record<ToastTone, typeof RiInformationLine> = {
  default: RiInformationLine,
  info: RiInformationLine,
  success: RiCheckboxCircleLine,
  warning: RiAlertLine,
  danger: RiErrorWarningLine
}

export interface ToastProps<T extends object = ToastData> extends Omit<AriaToastProps<T>, 'children'> {
  tone?: ToastTone
  children?: ReactNode
}

export function Toast<T extends object = ToastData>({
  tone = 'default',
  className,
  children,
  ...props
}: ToastProps<T>) {
  const Icon = toastToneIcons[tone]

  return (
    <AriaToast
      data-tone={tone}
      className={composeRenderProps(className, (cn) => clsx('pd-toast', cn))}
      {...props}
    >
      <Icon className="pd-toast-icon" aria-hidden="true" />

      <div className="pd-toast-content">
        {children}
      </div>

      <AriaButton
        slot="close"
        className="pd-reset pd-toast-close"
      >
        <RiCloseLine className="pd-toast-close-icon" aria-hidden="true" />
      </AriaButton>
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
  children?: (renderProps: { toast: QueuedToast<T> }) => ReactElement
}

export function ToastRegion<T extends object = ToastData>({
  queue = toastQueue as unknown as UNSTABLE_ToastQueue<T>,
  className,
  children,
  ...props
}: ToastRegionProps<T>) {
  return (
    <AriaToastRegion
      queue={queue}
      className={composeRenderProps(className, (cn) => clsx('pd-toast-region', cn))}
      {...props}
    >
      {children ??
        ((renderProps: { toast: QueuedToast<T> }) => {
          const toastData = renderProps.toast.content as unknown as ToastData
          return (
            <Toast toast={renderProps.toast} tone={toastData?.tone}>
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
