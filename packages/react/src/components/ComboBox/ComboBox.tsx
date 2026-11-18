import { type ReactNode } from 'react'
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  type InputProps as AriaInputProps,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { RiArrowDownSLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  composeTailwindRenderProps,
  fieldWrapperClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  fieldGroupVariants,
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
      className={composeTailwindRenderProps(className, 'min-w-[var(--trigger-width)]')}
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
        <Input placeholder={placeholder} {...inputProps} />
        <FieldButton>
          <RiArrowDownSLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
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
