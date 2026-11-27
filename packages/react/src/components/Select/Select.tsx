import { useContext, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  ButtonContext,
  composeRenderProps,
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
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps,
  type ResolvedClearable
} from '../../utils/index.ts'
import { Button, type ButtonActionProps } from '../Button/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  type FieldSize,
  Label
} from '../Field/index.ts'
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

export type SelectSelectionMode = 'single' | 'multiple'

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
      className={composeRenderProps(className, (cn) => clsx('pd-field-group', 'pd-field-group-compact-end', 'pd-select-trigger', cn))}
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
  const hasSelection = state
    ? Array.isArray(state.value)
      ? state.value.length > 0
      : state.value != null || state.selectedKey != null
    : false
  const showClear = clearable.enabled && !isDisabled && hasSelection

  const handleClear = () => {
    if (!state) return
    state.setValue(selectionMode === 'multiple' ? [] : null)
    onClear?.()
    clearable.onClear?.()
  }

  return (
    <div className="pd-select-control" data-size={size}>
      <SelectTrigger
        size={size}
        data-has-clear={showClear ? '' : undefined}
        {...triggerProps}
      >
        <SelectValue<T>>{renderValue}</SelectValue>
        <span className="pd-select-chevron-slot" aria-hidden="true">
          {renderIcon(icons?.chevron, 'chevronDown', 'pd-select-chevron')}
        </span>
      </SelectTrigger>

      {showClear && (
        <ButtonContext.Provider value={null}>
          <FieldButton
            slot={null}
            className="pd-field-clear pd-select-clear"
            aria-label={clearable.label}
            onPress={handleClear}
          >
            {renderIcon(clearable.icon ?? icons?.clear, 'clear', 'pd-field-icon')}
          </FieldButton>
        </ButtonContext.Provider>
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
      className={composeRenderProps(className, (cn) => clsx('pd-field', cn))}
      placeholder={placeholder}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}

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

      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldError>{errorMessage}</FieldError>

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
    </AriaSelect>
  )
}

export default Select
