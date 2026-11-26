import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps
} from 'react-aria-components'
import {
  resolveDisableableProps,
  type DisableableProps,
  type FieldSharedProps,
  type SelectionControlProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export interface RadioProps
  extends Omit<AriaRadioProps, 'children'>,
  SelectionControlProps {
  children?: ReactNode | AriaRadioProps['children']
}

export function Radio({
  label,
  description,
  className,
  children,
  ...props
}: RadioProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaRadio
      className={composeRenderProps(className, (cn) => clsx('pd-selection-control', 'pd-radio', cn))}
      {...ariaProps}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        const { isSelected } = renderProps

        return (
          <>
            <span className="pd-radio-circle">
              {isSelected && <span className="pd-radio-dot" />}
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
    </AriaRadio>
  )
}

export interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, 'children'>,
  FieldSharedProps,
  DisableableProps {
  orientation?: 'vertical' | 'horizontal'
  children?: ReactNode
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  orientation = 'vertical',
  className,
  children,
  ...props
}: RadioGroupProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaRadioGroup
      orientation={orientation}
      className={composeRenderProps(className, (cn) => clsx('pd-radio-group', cn))}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="pd-radio-group-items" data-orientation={orientation}>
        {children}
      </div>
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  )
}

export default Radio
