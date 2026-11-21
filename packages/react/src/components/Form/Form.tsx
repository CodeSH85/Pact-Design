import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Form as AriaForm,
  FormContext as AriaFormContext,
  type FormProps as AriaFormProps
} from 'react-aria-components'

export type FormGap = 'sm' | 'md' | 'lg'
export type FormActionsAlign = 'start' | 'center' | 'end' | 'between'

export interface FormSectionProps {
  title?: ReactNode
  description?: ReactNode
  className?: string
  children?: ReactNode
}

export function FormSection({ title, description, className, children }: FormSectionProps) {
  return (
    <div className={clsx('pd-form-section', className)}>
      {(title || description) && (
        <div className="pd-form-section-header">
          {title && <h3 className="pd-form-section-title">{title}</h3>}
          {description && <p className="pd-form-section-description">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export interface FormActionsProps {
  align?: FormActionsAlign
  className?: string
  children?: ReactNode
}

export function FormActions({ align = 'end', className, children }: FormActionsProps) {
  return (
    <div data-align={align} className={clsx('pd-form-actions', className)}>
      {children}
    </div>
  )
}

export interface FormProps extends AriaFormProps {
  gap?: FormGap
  className?: string
  children?: ReactNode
}

export function Form({ gap = 'md', className, children, ...props }: FormProps) {
  return (
    <AriaForm
      data-gap={gap}
      className={clsx('pd-form', className)}
      {...props}
    >
      {children}
    </AriaForm>
  )
}

export const FormContext = AriaFormContext
export default Form
