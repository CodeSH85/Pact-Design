import { type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import {
  Button as AriaButton,
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
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps, focusRing } from '../../utils/index.ts'

export type ToastTone = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface ToastData {
  title?: ReactNode
  description?: ReactNode
  tone?: ToastTone
}

export const toastVariants = cva(
  [
    'flex items-start gap-toast-container-gap w-full p-toast-container-padding rounded-toast-container border shadow-toast-container-shadow select-none',
    'transition-all duration-normal ease-default',
    'entering:animate-in entering:fade-in-0 entering:slide-in-from-right-full',
    'exiting:animate-out exiting:fade-out-0 exiting:slide-out-to-right-full'
  ].join(' '),
  {
    variants: {
      tone: {
        default: 'bg-toast-tone-default-bg border-toast-tone-default-border text-toast-tone-default-text',
        info: 'bg-toast-tone-info-bg border-toast-tone-info-border text-toast-tone-info-text',
        success: 'bg-toast-tone-success-bg border-toast-tone-success-border text-toast-tone-success-text',
        warning: 'bg-toast-tone-warning-bg border-toast-tone-warning-border text-toast-tone-warning-text',
        danger: 'bg-toast-tone-danger-bg border-toast-tone-danger-border text-toast-tone-danger-text'
      }
    },
    defaultVariants: {
      tone: 'default'
    }
  }
)

const toastToneIconConfig: Record<
  ToastTone,
  { Icon: typeof RiInformationLine; className: string }
> = {
  default: { Icon: RiInformationLine, className: 'text-toast-tone-default-icon' },
  info: { Icon: RiInformationLine, className: 'text-toast-tone-info-icon' },
  success: { Icon: RiCheckboxCircleLine, className: 'text-toast-tone-success-icon' },
  warning: { Icon: RiAlertLine, className: 'text-toast-tone-warning-icon' },
  danger: { Icon: RiErrorWarningLine, className: 'text-toast-tone-danger-icon' }
}

export interface ToastProps<T extends object = ToastData>
  extends AriaToastProps<T>,
  VariantProps<typeof toastVariants> {
  className?: string
  children?: ReactNode
}

export function Toast<T extends object = ToastData>({
  tone = 'default',
  className,
  children,
  ...props
}: ToastProps<T>) {
  const resolvedTone = tone ?? 'default'
  const { Icon, className: iconToneClass } = toastToneIconConfig[resolvedTone]

  return (
    <AriaToast
      className={composeTailwindRenderProps(className, toastVariants({ tone: resolvedTone }))}
      {...props}
    >
      <Icon className={cn('w-icon-sm h-icon-sm shrink-0 mt-0.5', iconToneClass)} aria-hidden="true" />

      <div className="flex flex-col gap-3xs flex-1 min-w-0">
        {children}
      </div>

      <AriaButton
        slot="close"
        className={cn(
          'inline-flex items-center justify-center p-3xs ml-auto -mr-xs -mt-xs rounded-2xs text-on-surface-muted hover:text-on-surface hover:bg-hover cursor-pointer',
          focusRing
        )}
      >
        <RiCloseLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
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
    <AriaToastContent className={cn('flex flex-col gap-3xs flex-1 min-w-0', className)} {...props}>
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
  className?: string
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
      className={composeTailwindRenderProps(
        className,
        'fixed bottom-lg right-lg z-toast-container flex flex-col gap-sm max-w-toast-container w-full outline-none pointer-events-none [&>*]:pointer-events-auto'
      )}
      {...props}
    >
      {children ??
        ((renderProps: { toast: QueuedToast<T> }) => {
          const toastData = renderProps.toast.content as unknown as ToastData
          return (
            <Toast toast={renderProps.toast} tone={toastData?.tone}>
              {toastData?.title && (
                <h4 className="text-label-sm font-semibold m-0">{toastData.title}</h4>
              )}
              {toastData?.description && (
                <p className="text-caption-md opacity-90 m-0">{toastData.description}</p>
              )}
            </Toast>
          )
        })}
    </AriaToastRegion>
  )
}

export { AriaToastList as ToastList }
export default Toast
