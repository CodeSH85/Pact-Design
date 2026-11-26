import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  composeRenderProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import {
  resolveDisableableProps,
  resolveToggleProps,
  type DisableableProps,
  type FieldSharedProps,
  type ToggleControlProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export interface CheckboxIcons {
  check?: IconSlot
  indeterminate?: IconSlot
}

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'children'>,
  ToggleControlProps {
  icons?: CheckboxIcons
  children?: ReactNode | AriaCheckboxProps['children']
}

export function Checkbox({
  label,
  description,
  icons,
  className,
  children,
  ...props
}: CheckboxProps) {
  const ariaProps = resolveToggleProps(props)

  return (
    <AriaCheckbox
      {...ariaProps}
      className={composeRenderProps(className, (cn) => clsx('pd-selection-control', 'pd-checkbox', cn))}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        const { isSelected: selected, isIndeterminate } = renderProps

        return (
          <>
            <span className="pd-checkbox-box">
              {isIndeterminate
                ? renderIcon(icons?.indeterminate, 'indeterminate', 'pd-checkbox-icon')
                : selected
                  ? renderIcon(icons?.check, 'check', 'pd-checkbox-icon')
                  : null}
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
    </AriaCheckbox>
  )
}

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'children'>,
  FieldSharedProps,
  DisableableProps {
  children?: ReactNode
}

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaCheckboxGroup
      className={composeRenderProps(className, (cn) => clsx('pd-checkbox-group', cn))}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="pd-checkbox-group-items">{children}</div>
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  )
}

export default Checkbox
