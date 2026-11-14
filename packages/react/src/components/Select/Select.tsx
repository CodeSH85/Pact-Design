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
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps, focusRing, focusRingInset } from '../../utils/index.ts'
import { FieldDescription, FieldError, Label } from '../Field/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

export const selectTriggerVariants = cva(
  [
    'group inline-flex items-center justify-between w-full select-none cursor-pointer',
    'bg-layer-1 border border-border-default rounded-sm text-on-surface',
    'transition-colors duration-fast ease-default',
    'hover:border-border-strong',
    'data-[focused]:border-border-focus data-[focus-visible]:border-border-focus',
    'data-[open]:border-border-focus',
    'data-[invalid]:border-danger data-[invalid]:hover:border-danger-hover',
    'data-[disabled]:bg-disabled data-[disabled]:border-border-subtle data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed',
    focusRing
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-control-xs px-xs gap-2xs text-label-xs rounded-xs',
        sm: 'h-control-sm px-sm gap-xs text-label-sm rounded-sm',
        md: 'h-control-md px-md gap-xs text-label-md rounded-sm',
        lg: 'h-control-lg px-lg gap-sm text-label-lg rounded-md',
        xl: 'h-control-xl px-xl gap-sm text-label-xl rounded-md'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface SelectTriggerProps
  extends AriaButtonProps,
  VariantProps<typeof selectTriggerVariants> {
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
        'truncate text-inherit data-[placeholder]:text-on-surface-disabled'
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

export interface SelectPopoverProps extends AriaPopoverProps {
  className?: string
}

export function SelectPopover({ className, children, ...props }: SelectPopoverProps) {
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

export function SelectListBox<T extends object = object>({
  className,
  children,
  ...props
}: AriaListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(
        className,
        'outline-none flex flex-col gap-3xs max-h-60 overflow-auto p-2xs'
      )}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export function SelectHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader
      className={cn(
        'px-sm py-2xs text-caption-sm font-medium text-on-surface-muted select-none',
        className
      )}
      {...props}
    >
      {children}
    </AriaHeader>
  )
}

export function SelectSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator
      className={cn('my-2xs h-px bg-border-subtle border-0', className)}
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
    <AriaListBoxSection className={cn('flex flex-col gap-3xs', className)} {...props}>
      {children}
    </AriaListBoxSection>
  )
}

export interface SelectProps<T extends object = object>
  extends Omit<AriaSelectProps<T>, 'children'>,
  VariantProps<typeof selectTriggerVariants> {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
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
      className={composeTailwindRenderProps(className, 'flex flex-col gap-xs w-full')}
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
          className="w-icon-xs h-icon-xs text-on-surface-muted transition-transform duration-normal ease-default group-data-[open]:rotate-180 shrink-0"
          aria-hidden="true"
        />
      </AriaButton>

      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}

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
