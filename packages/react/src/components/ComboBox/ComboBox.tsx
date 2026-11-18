import { type ReactNode } from 'react'
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  collectionItemVariants,
  composeTailwindRenderProps,
  fieldIconButtonClasses,
  fieldInputClasses,
  fieldWrapperClasses,
  listBoxClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

export interface ComboBoxItemProps extends AriaListBoxItemProps {
  className?: string
  children?: ReactNode | AriaListBoxItemProps['children']
}

export function ComboBoxItem({ className, children, ...props }: ComboBoxItemProps) {
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

export const ComboBoxSection = AriaListBoxSection

export interface ComboBoxPopoverProps extends AriaPopoverProps {
  className?: string
}

export function ComboBoxPopover({ className, children, ...props }: ComboBoxPopoverProps) {
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

export function ComboBoxListBox<T extends object>({ className, children, ...props }: AriaListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(className, listBoxClasses)}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'>,
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  placeholder?: string
  inputProps?: AriaInputProps
  popoverProps?: ComboBoxPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  className?: string
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
      className={composeTailwindRenderProps(className, fieldWrapperClasses)}
      items={items}
      {...props}
    >
      {label && <Label>{label}</Label>}

      <FieldGroup size={size} className="pr-2xs">
        <AriaInput
          placeholder={placeholder}
          className={fieldInputClasses}
          {...inputProps}
        />
        <AriaButton className={fieldIconButtonClasses}>
          <RiArrowDownSLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
        </AriaButton>
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
