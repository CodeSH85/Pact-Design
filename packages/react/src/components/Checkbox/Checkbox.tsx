import { type ReactNode } from 'react'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps
} from 'react-aria-components'
import { RiCheckLine, RiSubtractLine } from '@remixicon/react'
import {
  composeTailwindRenderProps,
  groupFocusRing,
  resolveToggleProps,
  selectionControlDescriptionClasses,
  selectionControlLabelClasses,
  selectionControlLabelStackClasses,
  selectionControlRootClasses,
  type FieldSharedProps,
  type ToggleControlProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'

export const checkboxBoxClasses = [
  'inline-flex shrink-0 items-center justify-center',
  'w-checkbox-size h-checkbox-size rounded-checkbox-radius',
  'border border-checkbox-border bg-checkbox-bg text-checkbox-icon',
  'transition-colors duration-fast ease-default',
  'group-hover:border-checkbox-border-hover group-data-[hovered]:border-checkbox-border-hover',
  groupFocusRing,
  'group-data-[selected]:bg-checkbox-bg-selected group-data-[selected]:border-checkbox-border-selected',
  'group-data-[indeterminate]:bg-checkbox-bg-selected group-data-[indeterminate]:border-checkbox-border-selected',
  'group-data-[disabled]:bg-checkbox-bg-disabled group-data-[disabled]:border-checkbox-border-disabled group-data-[disabled]:text-checkbox-icon-disabled'
].join(' ')

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'children'>,
  ToggleControlProps {
  className?: string
  children?: ReactNode | AriaCheckboxProps['children']
}

export function Checkbox({
  label,
  description,
  className,
  children,
  ...props
}: CheckboxProps) {
  const ariaProps = resolveToggleProps(props)

  return (
    <AriaCheckbox
      {...ariaProps}
      className={composeTailwindRenderProps(className, selectionControlRootClasses)}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps)
        }

        if (children) {
          return children
        }

        const { isSelected: selected, isIndeterminate, isDisabled: itemDisabled } = renderProps

        return (
          <>
            <span className={checkboxBoxClasses}>
              {isIndeterminate ? (
                <RiSubtractLine className="w-checkbox-icon-size h-checkbox-icon-size" aria-hidden="true" />
              ) : selected ? (
                <RiCheckLine className="w-checkbox-icon-size h-checkbox-icon-size" aria-hidden="true" />
              ) : null}
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
    </AriaCheckbox>
  )
}

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'children'>,
  FieldSharedProps {
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
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  )
}

export default Checkbox
