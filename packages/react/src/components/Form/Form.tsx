import { type ReactNode } from 'react'
import {
  Form as AriaForm,
  FormContext as AriaFormContext,
  type FormProps as AriaFormProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps } from '../../utils/index.ts'

export const formVariants = cva('flex flex-col w-full', {
  variants: {
    gap: {
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg'
    }
  },
  defaultVariants: {
    gap: 'md'
  }
})

export interface FormSectionProps {
  title?: ReactNode
  description?: ReactNode
  className?: string
  children?: ReactNode
}

export function FormSection({ title, description, className, children }: FormSectionProps) {
  return (
    <div className={cn('flex flex-col gap-sm', className)}>
      {(title || description) && (
        <div className="flex flex-col gap-3xs">
          {title && <h3 className="text-label-md font-semibold text-on-surface m-0">{title}</h3>}
          {description && <p className="text-caption-md text-on-surface-muted m-0">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export interface FormActionsProps {
  align?: 'start' | 'center' | 'end' | 'between'
  className?: string
  children?: ReactNode
}

export function FormActions({ align = 'end', className, children }: FormActionsProps) {
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }[align]

  return (
    <div className={cn('flex items-center gap-sm pt-xs', alignmentClasses, className)}>
      {children}
    </div>
  )
}

export interface FormProps
  extends AriaFormProps,
  VariantProps<typeof formVariants> {
  className?: string
  children?: ReactNode
}

export function Form({ gap = 'md', className, children, ...props }: FormProps) {
  return (
    <AriaForm
      className={cn(formVariants({ gap }), className)}
      {...props}
    >
      {children}
    </AriaForm>
  )
}

export const FormContext = AriaFormContext
export default Form
