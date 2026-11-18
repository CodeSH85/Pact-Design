import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Separator as AriaSeparator,
  type ButtonProps as AriaButtonProps,
  type HeaderProps as AriaHeaderProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type PopoverProps as AriaPopoverProps,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  cn,
  collectionHeaderClasses,
  collectionItemVariants,
  collectionSectionClasses,
  collectionSeparatorClasses,
  composeTailwindRenderProps,
  fieldWrapperClasses,
  focusRing,
  listBoxClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, fieldGroupVariants, Label } from '../Field/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

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
  className?: string
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

export interface SelectItemProps extends AriaListBoxItemProps {
  className?: string
  children?: ReactNode | AriaListBoxItemProps['children']
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <AriaListBoxItem
      className={composeTailwindRenderProps(className, collectionItemVariants())}
      {...props}
    >
      {(renderProps) => (
        <>
          <span className="truncate">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
          {renderProps.isSelected && (
            <RiCheckLine className="w-icon-xs h-icon-xs text-primary shrink-0 ml-auto" aria-hidden="true" />
          )}
        </>
      )}
    </AriaListBoxItem>
  )
}

export interface SelectPopoverProps extends AriaPopoverProps {
  className?: string
}

export function SelectPopover({ className, children, ...props }: SelectPopoverProps) {
  return (
    <AriaPopover
      offset={6}
      className={composeTailwindRenderProps(
        className,
        popoverContentClasses,
        'min-w-[var(--trigger-width)]'
      )}
      {...props}
    >
      {children}
    </AriaPopover>
  )
}

export function SelectListBox<T extends object = object>({
  className,
  children,
  ...props
}: AriaListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(className, listBoxClasses)}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export function SelectHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader
      className={cn(collectionHeaderClasses, className)}
      {...props}
    >
      {children}
    </AriaHeader>
  )
}

export function SelectSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator
      className={cn(collectionSeparatorClasses, className)}
      {...props}
    />
  )
}

export function SelectSection<T extends object = object>({
  className,
  children,
  ...props
}: AriaListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection className={cn(collectionSectionClasses, className)} {...props}>
      {children}
    </AriaListBoxSection>
  )
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

      <AriaButton
        className={composeTailwindRenderProps(
          triggerProps?.className,
          selectTriggerVariants({ size })
        )}
        {...triggerProps}
      >
        <SelectValue />
        <RiArrowDownSLine
          className="w-icon-xs h-icon-xs text-field-text-muted transition-transform duration-normal ease-default group-data-[open]:rotate-180 shrink-0"
          aria-hidden="true"
        />
      </AriaButton>

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
