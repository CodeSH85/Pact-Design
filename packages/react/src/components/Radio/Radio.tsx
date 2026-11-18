import { type ReactNode } from 'react'
import {
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps
} from 'react-aria-components'
import {
  composeTailwindRenderProps,
  groupFocusRing,
  resolveDisabled,
  selectionControlDescriptionClasses,
  selectionControlLabelClasses,
  selectionControlLabelStackClasses,
  selectionControlRootClasses,
  type FieldSharedProps,
  type SelectionControlProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export const radioCircleClasses = [
  'inline-flex shrink-0 items-center justify-center',
  'w-radio-size h-radio-size rounded-radio-radius',
  'border border-radio-border bg-radio-bg',
  'transition-colors duration-fast ease-default',
  'group-hover:border-radio-border-hover group-data-[hovered]:border-radio-border-hover',
  groupFocusRing,
  'group-data-[selected]:bg-radio-bg-selected group-data-[selected]:border-radio-border-selected',
  'group-data-[disabled]:bg-radio-bg-disabled group-data-[disabled]:border-radio-border-disabled'
].join(' ')

export interface RadioProps
  extends Omit<AriaRadioProps, 'children'>,
  SelectionControlProps {
  className?: string
  children?: ReactNode | AriaRadioProps['children']
}

export function Radio({
  label,
  description,
  disabled,
  isDisabled,
  className,
  children,
  ...props
}: RadioProps) {
  return (
    <AriaRadio
      isDisabled={resolveDisabled({ disabled, isDisabled })}
      className={composeTailwindRenderProps(className, selectionControlRootClasses)}
      {...props}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        const { isSelected, isDisabled: itemDisabled } = renderProps

        return (
          <>
            <span className={radioCircleClasses}>
              {isSelected && (
                <span
                  className={`w-radio-dot-size h-radio-dot-size rounded-radio-radius ${
                    itemDisabled ? 'bg-radio-dot-disabled' : 'bg-radio-dot'
                  }`}
                />
              )}
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
    </AriaRadio>
  )
}

export interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, 'children'>,
  FieldSharedProps {
  orientation?: 'vertical' | 'horizontal'
  className?: string
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
  return (
    <AriaRadioGroup
      orientation={orientation}
      className={composeTailwindRenderProps(
        className,
        'flex flex-col gap-xs'
      )}
      {...props}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div
        className={
          orientation === 'horizontal'
            ? 'flex flex-wrap items-start gap-md'
            : 'flex flex-col gap-sm'
        }
      >
        {children}
      </div>
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  )
}

export default Radio
