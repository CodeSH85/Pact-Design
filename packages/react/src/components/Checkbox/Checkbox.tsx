import { type ReactNode } from 'react'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps
} from 'react-aria-components'
import { RiCheckLine, RiSubtractLine } from '@remixicon/react'
import { composeTailwindRenderProps } from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (isSelected: boolean) => void
  className?: string
  children?: ReactNode | AriaCheckboxProps['children']
}

export function Checkbox({
  label,
  description,
  checked,
  isSelected,
  defaultChecked,
  defaultSelected,
  disabled,
  isDisabled,
  onCheckedChange,
  onChange,
  className,
  children,
  ...props
}: CheckboxProps) {
  const resolvedDisabled = isDisabled ?? disabled
  const resolvedSelected = isSelected ?? checked
  const resolvedDefault = defaultSelected ?? defaultChecked
  const resolvedOnChange = onChange ?? onCheckedChange

  const boxClasses = [
    'inline-flex shrink-0 items-center justify-center',
    'w-checkbox-size h-checkbox-size rounded-checkbox-radius',
    'border border-checkbox-border bg-checkbox-bg text-checkbox-icon',
    'transition-colors duration-fast ease-default',
    'group-hover:border-checkbox-border-hover group-data-[hovered]:border-checkbox-border-hover',
    'group-data-[focus-visible]:outline group-data-[focus-visible]:outline-2',
    'group-data-[focus-visible]:outline-border-focus group-data-[focus-visible]:outline-offset-2',
    'group-data-[selected]:bg-checkbox-bg-selected group-data-[selected]:border-checkbox-border-selected',
    'group-data-[indeterminate]:bg-checkbox-bg-selected group-data-[indeterminate]:border-checkbox-border-selected',
    'group-data-[disabled]:bg-checkbox-bg-disabled group-data-[disabled]:border-checkbox-border-disabled group-data-[disabled]:text-checkbox-icon-disabled'
  ].join(' ')

  return (
    <AriaCheckbox
      isSelected={resolvedSelected}
      defaultSelected={resolvedDefault}
      isDisabled={resolvedDisabled}
      onChange={resolvedOnChange}
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

        const { isSelected: selected, isIndeterminate } = renderProps

        return (
          <>
            <span className={boxClasses}>
              {isIndeterminate ? (
                <RiSubtractLine className="w-checkbox-icon-size h-checkbox-icon-size" aria-hidden="true" />
              ) : selected ? (
                <RiCheckLine className="w-checkbox-icon-size h-checkbox-icon-size" aria-hidden="true" />
              ) : null}
            </span>

            {(label || description) && (
              <span className="flex flex-col gap-3xs">
                {label && (
                  <span
                    className={`text-label-md leading-tight ${
                      resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface'
                    }`}
                  >
                    {label}
                  </span>
                )}
                {description && (
                  <span
                    className={`text-caption-md ${
                      resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'
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
    </AriaCheckbox>
  )
}

export interface CheckboxGroupProps extends AriaCheckboxGroupProps {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  className?: string
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
      className={composeTailwindRenderProps(
        className,
        'flex flex-col gap-xs'
      )}
      {...props}
    >
      {label && <Label>{label}</Label>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="flex flex-col gap-sm">{children}</div>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaCheckboxGroup>
  )
}

export default Checkbox
