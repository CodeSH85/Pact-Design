import { type ReactNode } from 'react'
import {
  Button as AriaButton,
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
import { type VariantProps } from 'class-variance-authority'
import {
  cn,
  composeTailwindRenderProps,
  fieldWrapperClasses,
  focusRing,
  type FieldSharedProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, fieldGroupVariants, Label } from '../Field/index.ts'
import {
  ListBox,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
  ListBoxSeparator,
  type ListBoxItemProps
} from '../ListBox/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export function selectTriggerVariants(
  variants?: VariantProps<typeof fieldGroupVariants>
) {
  return cn(
    fieldGroupVariants(variants),
    'group justify-between cursor-pointer data-[open]:border-field-border-focus',
    focusRing
  )
}

export interface SelectTriggerProps
  extends AriaButtonProps,
  VariantProps<typeof fieldGroupVariants> {
  children?: ReactNode
}

export function SelectTrigger({
  size = 'md',
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <AriaButton
      className={composeTailwindRenderProps(className, selectTriggerVariants({ size }))}
      {...props}
    >
      {children}
    </AriaButton>
  )
}

export interface SelectValueProps<T extends object = object> extends AriaSelectValueProps<T> {
  className?: string
}

export function SelectValue<T extends object = object>({ className, ...props }: SelectValueProps<T>) {
  return (
    <AriaSelectValue
      className={composeTailwindRenderProps(
        className,
        'truncate text-inherit data-[placeholder]:text-field-text-placeholder'
      )}
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
      className={composeTailwindRenderProps(className, 'min-w-[var(--trigger-width)]')}
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
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  placeholder?: string
  items?: Iterable<T>
  triggerProps?: AriaButtonProps
  popoverProps?: SelectPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  className?: string
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
      className={composeTailwindRenderProps(className, fieldWrapperClasses)}
      placeholder={placeholder}
      {...props}
    >
      {label && <Label>{label}</Label>}

      <SelectTrigger size={size} {...triggerProps}>
        <SelectValue />
        <RiArrowDownSLine
          className="w-icon-xs h-icon-xs text-field-text-muted transition-transform duration-normal ease-default group-data-[open]:rotate-180 shrink-0"
          aria-hidden="true"
        />
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
