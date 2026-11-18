import { type ReactNode } from 'react'
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  groupFocusRing,
  resolveToggleProps,
  selectionControlDescriptionClasses,
  selectionControlLabelClasses,
  selectionControlLabelStackClasses,
  selectionControlRootClasses,
  type ToggleControlProps
} from '../../utils/index.ts'

export const switchTrackVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-switch-track-radius cursor-pointer',
    'bg-switch-track-bg-unchecked border border-switch-track-border-unchecked',
    'transition-colors duration-normal ease-default',
    groupFocusRing,
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
  VariantProps<typeof switchTrackVariants>,
  ToggleControlProps {
  children?: ReactNode | AriaSwitchProps['children']
}

export function Switch({
  size = 'md',
  label,
  description,
  className,
  children,
  ...props
}: SwitchProps) {
  const ariaProps = resolveToggleProps(props)

  return (
    <AriaSwitch
      {...ariaProps}
      className={composeTailwindRenderProps(className, selectionControlRootClasses)}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        const { isDisabled: itemDisabled } = renderProps

        return (
          <>
            <span className={switchTrackVariants({ size })}>
              <span className={switchThumbVariants({ size })} />
            </span>

            {(label || description) && (
              <span className={selectionControlLabelStackClasses}>
                {label && (
                  <span className={selectionControlLabelClasses(itemDisabled)}>
                    {label}
                  </span>
                )}
                {description && (
                  <span className={selectionControlDescriptionClasses(itemDisabled)}>
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
