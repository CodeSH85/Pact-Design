import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps
} from 'react-aria-components'
import {
  resolveToggleProps,
  type ToggleControlProps
} from '../../utils/index.ts'

export type SwitchSize = 'sm' | 'md'

export interface SwitchProps
  extends Omit<AriaSwitchProps, 'children'>,
  ToggleControlProps {
  size?: SwitchSize
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
      className={composeRenderProps(className, (cn) => clsx('pd-selection-control', 'pd-switch', cn))}
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
            <span className="pd-switch-track" data-size={size}>
              <span className="pd-switch-thumb" data-size={size} />
            </span>

            {(label || description) && (
              <span className="pd-selection-control-content">
                {label && (
                  <span className="pd-selection-control-label">
                    {label}
                  </span>
                )}
                {description && (
                  <span className="pd-selection-control-description">
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
