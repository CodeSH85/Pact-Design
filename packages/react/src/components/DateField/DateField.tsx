import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateValue
} from 'react-aria-components'
import { type FieldSharedProps } from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, type FieldSize, Label } from '../Field/index.ts'

export type DateSegmentProps = AriaDateSegmentProps

export function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (cn) => clsx('pd-date-segment', cn))}
      {...props}
    />
  )
}

export interface DateInputProps extends Omit<AriaDateInputProps, 'children'> {
  children?: AriaDateInputProps['children']
}

export function DateInput({ className, children, ...props }: DateInputProps) {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (cn) => clsx('pd-date-input', cn))}
      {...props}
    >
      {children ?? ((segment) => <DateSegment segment={segment} />)}
    </AriaDateInput>
  )
}

export interface DateFieldProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, 'children'>,
  FieldSharedProps {
  size?: FieldSize
  dateInputProps?: DateInputProps
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
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      {...props}
    >
      {label && <Label>{label}</Label>}

      {children ?? (
        <FieldGroup size={size}>
          <DateInput {...dateInputProps} />
        </FieldGroup>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  )
}

export default DateField
export type { DateValue }
