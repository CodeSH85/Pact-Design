import { type ReactNode } from 'react'
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateValue
} from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'
import { composeTailwindRenderProps } from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'

export interface DateSegmentProps extends AriaDateSegmentProps {
  className?: string
}

export function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <AriaDateSegment
      className={composeTailwindRenderProps(
        className,
        [
          'px-3xs rounded-2xs tabular-nums font-mono text-inherit outline-none',
          'data-[placeholder]:text-on-surface-disabled',
          'data-[focused]:bg-primary data-[focused]:text-on-primary',
          'data-[invalid]:data-[focused]:bg-danger data-[invalid]:data-[focused]:text-on-danger'
        ].join(' ')
      )}
      {...props}
    />
  )
}

export interface DateInputProps extends Omit<AriaDateInputProps, 'children'> {
  className?: string
  children?: AriaDateInputProps['children']
}

export function DateInput({ className, children, ...props }: DateInputProps) {
  return (
    <AriaDateInput
      className={composeTailwindRenderProps(
        className,
        'flex items-center gap-3xs select-none w-full bg-transparent'
      )}
      {...props}
    >
      {children ?? ((segment) => <DateSegment segment={segment} />)}
    </AriaDateInput>
  )
}

export interface DateFieldProps<T extends DateValue>
  extends AriaDateFieldProps<T>,
  VariantProps<typeof fieldGroupVariants> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  dateInputProps?: DateInputProps
  className?: string
  children?: ReactNode
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  dateInputProps,
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      className={composeTailwindRenderProps(className, 'flex flex-col gap-xs w-full')}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup size={size}>
          <DateInput {...dateInputProps} />
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaDateField>
  )
}

export default DateField
