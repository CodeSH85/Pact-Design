import { type ReactNode } from 'react'
import { type ValidationResult } from 'react-aria-components'

export type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Standard form field metadata props shared across input/picker controls and field groups.
 */
export interface FieldSharedProps {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode)
}

/**
 * Supports both native HTML (`disabled`) and React Aria (`isDisabled`) conventions.
 */
export interface DisableableProps {
  disabled?: boolean
  isDisabled?: boolean
}

export function resolveDisabled(props: DisableableProps): boolean | undefined {
  return props.isDisabled ?? props.disabled
}

/**
 * Shared label/description/disabled props for inline selection controls (Checkbox, Switch, Radio).
 */
export interface SelectionControlProps extends DisableableProps {
  label?: ReactNode
  description?: ReactNode
}

/**
 * Supports both HTML checkbox (`checked`, `defaultChecked`, `onCheckedChange`) and React Aria toggle props.
 */
export interface ToggleControlProps extends SelectionControlProps {
  checked?: boolean
  isSelected?: boolean
  defaultChecked?: boolean
  defaultSelected?: boolean
  onCheckedChange?: (isSelected: boolean) => void
  onChange?: (isSelected: boolean) => void
}

export function resolveToggleProps<T extends ToggleControlProps>(props: T) {
  const {
    disabled,
    isDisabled,
    checked,
    isSelected,
    defaultChecked,
    defaultSelected,
    onCheckedChange,
    onChange,
    ...rest
  } = props

  return {
    ...rest,
    isDisabled: isDisabled ?? disabled,
    isSelected: isSelected ?? checked,
    defaultSelected: defaultSelected ?? defaultChecked,
    onChange: onChange ?? onCheckedChange
  }
}

/**
 * Shared shorthand chrome props for overlay containers (Modal, Sheet).
 */
export interface OverlaySharedProps {
  trigger?: ReactNode
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  isDismissable?: boolean
}
