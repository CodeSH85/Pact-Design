import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  composeRenderProps,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type ButtonProps as AriaButtonProps,
  type HeaderProps as AriaHeaderProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type PopoverProps as AriaPopoverProps,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiArrowDownSLine } from '@remixicon/react'
import { type FieldSharedProps } from '../../utils/index.ts'
import { FieldDescription, FieldError, type FieldSize, Label } from '../Field/index.ts'
import {
  ListBox,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
  ListBoxSeparator,
  type ListBoxItemProps
} from '../ListBox/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export interface SelectTriggerProps extends Omit<AriaButtonProps, 'children'> {
  size?: FieldSize
  children?: ReactNode | AriaButtonProps['children']
}

export function SelectTrigger({
  size = 'md',
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <AriaButton
      data-size={size}
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-field-group', 'pd-select-trigger', cn))}
      {...props}
    >
      {children}
    </AriaButton>
  )
}

export type SelectValueProps<T extends object = object> = AriaSelectValueProps<T>

export function SelectValue<T extends object = object>({ className, ...props }: SelectValueProps<T>) {
  return (
    <AriaSelectValue
      className={composeRenderProps(className, (cn) => clsx('pd-select-value', cn))}
      {...props}
    />
  )
}

export type SelectItemProps = ListBoxItemProps

export function SelectItem(props: SelectItemProps) {
  return <ListBoxItem {...props} />
}

export type SelectPopoverProps = AriaPopoverProps

export function SelectPopover({ className, children, ...props }: SelectPopoverProps) {
  return (
    <PopoverContent
      className={composeRenderProps(className, (cn) => clsx('pd-popover-trigger-width', cn))}
      {...props}
    >
      {children}
    </PopoverContent>
  )
}

export function SelectListBox<T extends object = object>({
  children,
  ...props
}: AriaListBoxProps<T>) {
  return <ListBox {...props}>{children}</ListBox>
}

export function SelectHeader({ children, ...props }: AriaHeaderProps) {
  return <ListBoxHeader {...props}>{children}</ListBoxHeader>
}

export function SelectSeparator(props: AriaSeparatorProps) {
  return <ListBoxSeparator {...props} />
}

export function SelectSection<T extends object = object>({
  children,
  ...props
}: AriaListBoxSectionProps<T>) {
  return <ListBoxSection {...props}>{children}</ListBoxSection>
}

export interface SelectProps<T extends object = object>
  extends Omit<AriaSelectProps<T>, 'children'>,
  FieldSharedProps {
  size?: FieldSize
  placeholder?: string
  items?: Iterable<T>
  triggerProps?: AriaButtonProps
  popoverProps?: SelectPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  children: ReactNode | ((item: T) => ReactNode)
}

export function Select<T extends object = object>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  items,
  triggerProps,
  popoverProps,
  listBoxProps,
  className,
  children,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      placeholder={placeholder}
      {...props}
    >
      {label && <Label>{label}</Label>}

      <SelectTrigger size={size} {...triggerProps}>
        <SelectValue />
        <RiArrowDownSLine className="pd-select-chevron" aria-hidden="true" />
      </SelectTrigger>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>

      <SelectPopover {...popoverProps}>
        <SelectListBox items={items} {...listBoxProps}>
          {typeof children === 'function'
            ? children
            : (children as ReactNode)}
        </SelectListBox>
      </SelectPopover>
    </AriaSelect>
  )
}

export default Select
