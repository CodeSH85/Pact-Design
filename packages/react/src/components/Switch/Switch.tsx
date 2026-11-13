import { type ReactNode } from 'react'
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps, focusRing } from '../../utils/index.ts'

export const switchTrackVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-full cursor-pointer',
    'bg-layer-1-active border border-border-default',
    'transition-colors duration-normal ease-default',
    focusRing,
    'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
    'group-data-[disabled]:bg-disabled group-data-[disabled]:border-border-subtle group-data-[disabled]:cursor-not-allowed'
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-7 h-4 p-0.5',
        md: 'w-9 h-5 p-0.5'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-layer-2 shadow-elevation-xs',
    'transition-transform duration-normal ease-default'
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-3 h-3 group-data-[selected]:translate-x-3',
        md: 'w-4 h-4 group-data-[selected]:translate-x-4'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface SwitchProps
  extends Omit<AriaSwitchProps, 'children'>,
  VariantProps<typeof switchTrackVariants> {
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (isSelected: boolean) => void
  children?: ReactNode | AriaSwitchProps['children']
}

export function Switch({
  size = 'md',
  label,
  description,
  disabled,
  isDisabled,
  checked,
  isSelected,
  defaultChecked,
  defaultSelected,
  onCheckedChange,
  onChange,
  className,
  children,
  ...props
}: SwitchProps) {
  const resolvedDisabled = isDisabled ?? disabled
  const resolvedSelected = isSelected ?? checked
  const resolvedDefault = defaultSelected ?? defaultChecked
  const resolvedOnChange = onChange ?? onCheckedChange

  return (
    <AriaSwitch
      isSelected={resolvedSelected}
      defaultSelected={resolvedDefault}
      isDisabled={resolvedDisabled}
      onChange={resolvedOnChange}
      className={composeTailwindRenderProps(
        className,
        'group inline-flex items-start gap-xs select-none cursor-pointer data-[disabled]:cursor-not-allowed'
      )}
      {...props}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        return (
          <>
            <span className={switchTrackVariants({ size })}>
              <span className={switchThumbVariants({ size })} />
            </span>

            {(label || description) && (
              <span className="flex flex-col gap-3xs">
                {label && (
                  <span
                    className={`text-label-md leading-tight ${
                      resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface'
                    }`}
                  >
                    {label}
                  </span>
                )}
                {description && (
                  <span
                    className={`text-caption-md ${
                      resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'
                    }`}
                  >
                    {description}
                  </span>
                )}
              </span>
            )}
          </>
        )
      }}
    </AriaSwitch>
  )
}

export default Switch
