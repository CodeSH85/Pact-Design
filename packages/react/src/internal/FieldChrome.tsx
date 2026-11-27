import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { ButtonContext } from 'react-aria-components'
import { renderIcon, type IconSlot } from '../icons/index.ts'
import { type FieldSharedProps, type ResolvedClearable } from '../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  Label
} from '../components/Field/index.ts'

export interface FieldChromeProps extends FieldSharedProps {
  children: ReactNode
  afterError?: ReactNode
}

export function FieldChrome({
  label,
  description,
  errorMessage,
  children,
  afterError
}: FieldChromeProps) {
  return (
    <>
      {label && <Label>{label}</Label>}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      {afterError}
    </>
  )
}

export interface FieldClearButtonProps {
  clearable: ResolvedClearable
  fallbackIcon?: IconSlot
  className?: string
  /**
   * Isolates the button from parent React Aria `ButtonContext` (required for
   * TextField, Select, ComboBox, DateField, and DatePicker; set `false` for
   * SearchField where RAC owns the clear button slot).
   */
  isolated?: boolean
  onPress?: () => void
}

export function FieldClearButton({
  clearable,
  fallbackIcon,
  className,
  isolated = true,
  onPress
}: FieldClearButtonProps) {
  const button = (
    <FieldButton
      slot={isolated ? null : undefined}
      className={clsx('pd-field-clear', className)}
      aria-label={clearable.label}
      onPress={onPress}
    >
      {renderIcon(clearable.icon ?? fallbackIcon, 'clear', 'pd-field-icon')}
    </FieldButton>
  )

  return isolated ? (
    <ButtonContext.Provider value={null}>
      {button}
    </ButtonContext.Provider>
  ) : button
}
