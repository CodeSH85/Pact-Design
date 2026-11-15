import { type ReactNode } from 'react'
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps, focusRing } from '../../utils/index.ts'

export const switchTrackVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-switch-track-radius cursor-pointer',
    'bg-switch-track-bg-unchecked border border-switch-track-border-unchecked',
    'transition-colors duration-normal ease-default',
    focusRing,
    'group-data-[selected]:bg-switch-track-bg-checked group-data-[selected]:border-switch-track-border-checked',
    'group-data-[disabled]:bg-switch-track-bg-disabled group-data-[disabled]:border-switch-track-border-disabled group-data-[disabled]:cursor-not-allowed'
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-switch-track-sm h-switch-track-sm p-switch-track-padding',
        md: 'w-switch-track-md h-switch-track-md p-switch-track-padding'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-switch-thumb-radius bg-switch-thumb-bg shadow-switch-thumb-shadow',
    'transition-transform duration-normal ease-default'
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-switch-thumb-sm h-switch-thumb-sm group-data-[selected]:translate-x-switch-thumb-translate-sm',
        md: 'w-switch-thumb-md h-switch-thumb-md group-data-[selected]:translate-x-switch-thumb-translate-md'
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
