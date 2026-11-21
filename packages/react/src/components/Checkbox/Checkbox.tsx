import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  composeRenderProps
} from 'react-aria-components'
import { RiCheckLine, RiSubtractLine } from '@remixicon/react'
import {
  resolveToggleProps,
  type FieldSharedProps,
  type ToggleControlProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'children'>,
  ToggleControlProps {
  children?: ReactNode | AriaCheckboxProps['children']
}

export function Checkbox({
  label,
  description,
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
              {isIndeterminate ? (
                <RiSubtractLine className="pd-checkbox-icon" aria-hidden="true" />
              ) : selected ? (
                <RiCheckLine className="pd-checkbox-icon" aria-hidden="true" />
              ) : null}
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
  FieldSharedProps {
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
  return (
    <AriaCheckboxGroup
      className={composeRenderProps(className, (cn) => clsx('pd-checkbox-group', cn))}
      {...props}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="pd-checkbox-group-items">{children}</div>
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  )
}

export default Checkbox
