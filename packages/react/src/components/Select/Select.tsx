import { useContext, type ReactNode } from 'react'
import {
  Select as AriaSelect,
  SelectStateContext,
  SelectValue as AriaSelectValue
} from 'react-aria-components'
import type {
  HeaderProps as AriaHeaderProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
  PopoverProps as AriaPopoverProps,
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { dataAttrs, FieldChrome, FieldClearButton, pdClass } from '../../internal/index.ts'
import {
  hasSelection,
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps,
  type ResolvedClearable,
  type SelectionMode
} from '../../utils/index.ts'
import { Button, type ButtonActionProps } from '../Button/index.ts'
import { type FieldSize } from '../Field/index.ts'
import {
  ListBox,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
  ListBoxSeparator,
  type ListBoxItemProps
} from '../ListBox/index.ts'
import { PopoverContent } from '../Popover/index.ts'
import { type SeparatorProps } from '../Separator/index.ts'

export type SelectSelectionMode = SelectionMode

export interface SelectIcons {
  chevron?: IconSlot
  clear?: IconSlot
}

export interface SelectTriggerProps
  extends Omit<ButtonActionProps, 'variant' | 'size' | 'radius' | 'icon' | 'children'>,
  DisableableProps {
  size?: FieldSize
  children?: ButtonActionProps['children']
}

export function SelectTrigger({
  size = 'md',
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      className={pdClass(className, 'pd-field-group', 'pd-field-group-compact-end', 'pd-select-trigger')}
      {...props}
    >
      {children}
    </Button>
  )
}

export type SelectValueProps<T extends object = object> = AriaSelectValueProps<T>

export function SelectValue<T extends object = object>({ className, ...props }: SelectValueProps<T>) {
  return (
    <AriaSelectValue
      className={pdClass(className, 'pd-select-value')}
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
      className={pdClass(className, 'pd-popover-trigger-width')}
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

export function SelectSeparator(props: SeparatorProps) {
  return <ListBoxSeparator {...props} />
}

export function SelectSection<T extends object = object>({
  children,
  ...props
}: AriaListBoxSectionProps<T>) {
  return <ListBoxSection {...props}>{children}</ListBoxSection>
}

interface SelectControlProps<T extends object> {
  size: FieldSize
  selectionMode?: SelectSelectionMode
  isDisabled?: boolean
  clearable: ResolvedClearable
  onClear?: () => void
  icons?: SelectIcons
  renderValue?: SelectValueProps<T>['children']
  triggerProps?: SelectTriggerProps
}

function SelectControl<T extends object>({
  size,
  selectionMode = 'single',
  isDisabled,
  clearable,
  onClear,
  icons,
  renderValue,
  triggerProps
}: SelectControlProps<T>) {
  const state = useContext(SelectStateContext)
  const showClear = clearable.enabled && !isDisabled && hasSelection(state)

  const handleClear = () => {
    if (!state) return
    state.setValue(selectionMode === 'multiple' ? [] : null)
    onClear?.()
    clearable.onClear?.()
  }

  return (
    <div className="pd-select-control" {...dataAttrs({ size })}>
      <SelectTrigger
        size={size}
        {...dataAttrs({ 'has-clear': showClear })}
        {...triggerProps}
      >
        <SelectValue<T>>{renderValue}</SelectValue>
        <span className="pd-select-chevron-slot" aria-hidden="true">
          {renderIcon(icons?.chevron, 'chevronDown', 'pd-select-chevron')}
        </span>
      </SelectTrigger>

      {showClear && (
        <FieldClearButton
          clearable={clearable}
          fallbackIcon={icons?.clear}
          className="pd-select-clear"
          onPress={handleClear}
        />
      )}
    </div>
  )
}

export interface SelectProps<
  T extends object = object,
  M extends SelectSelectionMode = 'single'
> extends Omit<AriaSelectProps<T, M>, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  placeholder?: string
  items?: Iterable<T>
  clearable?: ClearableProp
  onClear?: () => void
  icons?: SelectIcons
  renderValue?: SelectValueProps<T>['children']
  triggerProps?: SelectTriggerProps
  popoverProps?: SelectPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  children: ReactNode | ((item: T) => ReactNode)
}

export function Select<
  T extends object = object,
  M extends SelectSelectionMode = 'single'
>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  items,
  clearable,
  onClear,
  icons,
  renderValue,
  triggerProps,
  popoverProps,
  listBoxProps,
  className,
  children,
  ...props
}: SelectProps<T, M>) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, false)

  return (
    <AriaSelect<T, M>
      className={pdClass(className, 'pd-field')}
      placeholder={placeholder}
      {...ariaProps}
    >
      <FieldChrome
        label={label}
        description={description}
        errorMessage={errorMessage}
        afterError={(
          <SelectPopover {...popoverProps}>
            <SelectListBox
              items={items}
              {...listBoxProps}
            >
              {typeof children === 'function'
                ? children
                : (children as ReactNode)}
            </SelectListBox>
          </SelectPopover>
        )}
      >
        <SelectControl<T>
          size={size}
          selectionMode={ariaProps.selectionMode}
          isDisabled={ariaProps.isDisabled}
          clearable={resolvedClearable}
          onClear={onClear}
          icons={icons}
          renderValue={renderValue}
          triggerProps={triggerProps}
        />
      </FieldChrome>
    </AriaSelect>
  )
}

export default Select
