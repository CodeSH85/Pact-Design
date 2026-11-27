import { type ReactNode } from 'react'
import {
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
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
      className={pdClass(className, 'pd-selection-control', 'pd-radio')}
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
      className={pdClass(className, 'pd-radio-group')}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="pd-radio-group-items" {...dataAttrs({ orientation })}>
        {children}
      </div>
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  )
}

export default Radio
