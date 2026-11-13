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
    'w-icon-md h-icon-md rounded-2xs',
    'border border-border-strong bg-layer-1 text-on-primary',
    'transition-colors duration-fast ease-default',
    'group-hover:border-primary group-data-[hovered]:border-primary',
    'group-data-[focus-visible]:outline group-data-[focus-visible]:outline-2',
    'group-data-[focus-visible]:outline-border-focus group-data-[focus-visible]:outline-offset-2',
    'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
    'group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary',
    'group-data-[disabled]:bg-disabled group-data-[disabled]:border-border-subtle group-data-[disabled]:text-on-surface-disabled'
  ].join(' ')

  return (
    <AriaCheckbox
      isSelected={resolvedSelected}
      defaultSelected={resolvedDefault}
      isDisabled={resolvedDisabled}
      onChange={resolvedOnChange}
      className={composeTailwindRenderProps(
        className,
        'group inline-flex items-start gap-xs select-none outline-none cursor-pointer data-[disabled]:cursor-not-allowed'
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
                <RiSubtractLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
              ) : selected ? (
                <RiCheckLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
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
