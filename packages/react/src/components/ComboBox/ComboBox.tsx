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
import { composeTailwindRenderProps, focusRingInset } from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

export interface ComboBoxItemProps extends AriaListBoxItemProps {
  className?: string
  children?: ReactNode | AriaListBoxItemProps['children']
}

export function ComboBoxItem({ className, children, ...props }: ComboBoxItemProps) {
  return (
    <AriaListBoxItem
      className={composeTailwindRenderProps(
        className,
        [
          'flex items-center justify-between gap-md',
          'h-control-sm px-sm rounded-xs',
          'text-label-sm text-on-surface select-none cursor-pointer',
          focusRingInset,
          'data-[focused]:bg-layer-2-hover data-[hovered]:bg-layer-2-hover',
          'data-[selected]:font-medium data-[selected]:text-on-surface',
          'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
        ].join(' ')
      )}
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
      className={composeTailwindRenderProps(className, popoverContentClasses)}
      {...props}
    >
      {children}
    </AriaPopover>
  )
}

export function ComboBoxListBox<T extends object>({ className, children, ...props }: AriaListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(className, 'outline-none flex flex-col gap-3xs max-h-60 overflow-auto p-2xs')}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'>,
  VariantProps<typeof fieldGroupVariants> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
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
      className={composeTailwindRenderProps(className, 'flex flex-col gap-xs w-full')}
      items={items}
      {...props}
    >
      {label && <Label>{label}</Label>}

      <FieldGroup size={size} className="pr-2xs">
        <AriaInput
          placeholder={placeholder}
          className="w-full bg-transparent border-0 outline-none p-0 text-inherit placeholder:text-on-surface-disabled"
          {...inputProps}
        />
        <AriaButton className="inline-flex items-center justify-center p-3xs rounded-2xs text-on-surface-muted hover:text-on-surface">
          <RiArrowDownSLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
        </AriaButton>
      </FieldGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}

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
