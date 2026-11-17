import { type ReactNode } from 'react'
import {
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps
} from 'react-aria-components'
import { composeTailwindRenderProps, groupFocusRing } from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export interface RadioProps extends Omit<AriaRadioProps, 'children'> {
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
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
  const resolvedDisabled = isDisabled ?? disabled

  const circleClasses = [
    'inline-flex shrink-0 items-center justify-center',
    'w-radio-size h-radio-size rounded-radio-radius',
    'border border-radio-border bg-radio-bg',
    'transition-colors duration-fast ease-default',
    'group-hover:border-radio-border-hover group-data-[hovered]:border-radio-border-hover',
    groupFocusRing,
    'group-data-[selected]:bg-radio-bg-selected group-data-[selected]:border-radio-border-selected',
    'group-data-[disabled]:bg-radio-bg-disabled group-data-[disabled]:border-radio-border-disabled'
  ].join(' ')

  return (
    <AriaRadio
      isDisabled={resolvedDisabled}
      className={composeTailwindRenderProps(
        className,
        'group relative inline-flex items-start gap-xs select-none outline-none cursor-pointer data-[disabled]:cursor-not-allowed'
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

        const { isSelected, isDisabled: itemDisabled } = renderProps

        return (
          <>
            <span className={circleClasses}>
              {isSelected && (
                <span
                  className={`w-radio-dot-size h-radio-dot-size rounded-radio-radius ${
                    itemDisabled ? 'bg-radio-dot-disabled' : 'bg-radio-dot'
                  }`}
                />
              )}
            </span>

            {(label || description) && (
              <span className="flex flex-col gap-3xs">
                {label && (
                  <span
                    className={`text-label-md leading-tight ${
                      itemDisabled ? 'text-on-surface-disabled' : 'text-on-surface'
                    }`}
                  >
                    {label}
                  </span>
                )}
                {description && (
                  <span
                    className={`text-caption-md ${
                      itemDisabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'
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
    </AriaRadio>
  )
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
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
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaRadioGroup>
  )
}

export default Radio
