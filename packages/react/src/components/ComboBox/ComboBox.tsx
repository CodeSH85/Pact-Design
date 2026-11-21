import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  ComboBox as AriaComboBox,
  composeRenderProps,
  type ComboBoxProps as AriaComboBoxProps,
  type InputProps as AriaInputProps,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiArrowDownSLine } from '@remixicon/react'
import { type FieldSharedProps } from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  Label
} from '../Field/index.ts'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  type ListBoxItemProps
} from '../ListBox/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export type ComboBoxItemProps = ListBoxItemProps

export function ComboBoxItem(props: ComboBoxItemProps) {
  return <ListBoxItem {...props} />
}

export const ComboBoxSection = ListBoxSection

export type ComboBoxPopoverProps = AriaPopoverProps

export function ComboBoxPopover({ className, children, ...props }: ComboBoxPopoverProps) {
  return (
    <PopoverContent
      className={composeRenderProps(className, (cn) => clsx('pd-popover-trigger-width', cn))}
      {...props}
    >
      {children}
    </PopoverContent>
  )
}

export function ComboBoxListBox<T extends object>({ children, ...props }: AriaListBoxProps<T>) {
  return <ListBox {...props}>{children}</ListBox>
}

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'>,
  FieldSharedProps {
  size?: FieldSize
  placeholder?: string
  inputProps?: AriaInputProps
  popoverProps?: ComboBoxPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  children: ReactNode | ((item: T) => ReactNode)
}

export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  inputProps,
  popoverProps,
  listBoxProps,
  className,
  children,
  items,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      items={items}
      {...props}
    >
      {label && <Label>{label}</Label>}

      <FieldGroup size={size} className="pd-field-group-compact-end">
        <Input placeholder={placeholder} {...inputProps} />
        <FieldButton>
          <RiArrowDownSLine className="pd-field-icon" aria-hidden="true" />
        </FieldButton>
      </FieldGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>

      <ComboBoxPopover {...popoverProps}>
        <ComboBoxListBox {...listBoxProps}>
          {typeof children === 'function'
            ? children
            : (children as ReactNode)}
        </ComboBoxListBox>
      </ComboBoxPopover>
    </AriaComboBox>
  )
}

export default ComboBox
