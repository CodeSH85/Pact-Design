import { useContext, useRef, type MouseEvent, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  ButtonContext,
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  ComboBoxValue as AriaComboBoxValue,
  type ComboBoxProps as AriaComboBoxProps,
  type ComboBoxValueProps as AriaComboBoxValueProps,
  type Key,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { FieldChrome, FieldClearButton, pdClass } from '../../internal/index.ts'
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
import {
  FieldButton,
  FieldGroup,
  type FieldSize,
  Input,
  type InputProps
} from '../Field/index.ts'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  type ListBoxItemProps
} from '../ListBox/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export type ComboBoxSelectionMode = SelectionMode

export interface ComboBoxIcons {
  chevron?: IconSlot
  clear?: IconSlot
  removeTag?: IconSlot
}

export type ComboBoxItemProps = ListBoxItemProps

export function ComboBoxItem(props: ComboBoxItemProps) {
  return <ListBoxItem {...props} />
}

export const ComboBoxSection = ListBoxSection
export const ComboBoxValue = AriaComboBoxValue
export type ComboBoxValueProps<T extends object = object> = AriaComboBoxValueProps<T>

export type ComboBoxPopoverProps = AriaPopoverProps

export function ComboBoxPopover({ className, children, ...props }: ComboBoxPopoverProps) {
  return (
    <PopoverContent
      className={pdClass(className, 'pd-popover-trigger-width')}
      {...props}
    >
      {children}
    </PopoverContent>
  )
}

export function ComboBoxListBox<T extends object>({ children, ...props }: AriaListBoxProps<T>) {
  return <ListBox {...props}>{children}</ListBox>
}

interface ComboBoxControlProps {
  size: FieldSize
  placeholder?: string
  selectionMode?: ComboBoxSelectionMode
  isDisabled?: boolean
  isReadOnly?: boolean
  clearable: ResolvedClearable
  onClear?: () => void
  icons?: ComboBoxIcons
  inputProps?: InputProps
}

function ComboBoxControl({
  size,
  placeholder,
  selectionMode = 'single',
  isDisabled,
  isReadOnly,
  clearable,
  onClear,
  icons,
  inputProps
}: ComboBoxControlProps) {
  const state = useContext(ComboBoxStateContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMultiple = selectionMode === 'multiple'

  const selectedItems = state?.selectedItems ?? []
  const hasValue = hasSelection(state) || Boolean(state?.inputValue)
  const showClear = clearable.enabled && !isDisabled && !isReadOnly && hasValue

  const handleGroupClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled || isReadOnly) return
    const target = event.target as HTMLElement | null
    if (target?.closest('button')) return

    inputRef.current?.focus()
    if (state && !state.isOpen) {
      state.open(null, 'manual')
    }
  }

  const handleRemoveTag = (key: Key) => {
    if (!state || isDisabled || isReadOnly) return
    const current = Array.isArray(state.value) ? state.value : []
    state.setValue(current.filter((itemKey) => itemKey !== key))
    inputRef.current?.focus()
  }

  const handleClear = () => {
    if (!state) return
    state.setValue(isMultiple ? [] : null)
    state.setInputValue('')
    onClear?.()
    clearable.onClear?.()
    inputRef.current?.focus()
  }

  return (
    <FieldGroup
      size={size}
      className={clsx(
        'pd-field-group-compact-end',
        isMultiple && 'pd-field-group-multiline'
      )}
      onClick={handleGroupClick}
    >
      {isMultiple ? (
        <div className="pd-combobox-tags">
          {selectedItems.map((item) => (
            <span key={String(item.key)} className="pd-combobox-tag">
              <span className="pd-combobox-tag-label">{item.textValue}</span>
              {!isDisabled && !isReadOnly && (
                <ButtonContext.Provider value={null}>
                  <FieldButton
                    slot={null}
                    className="pd-combobox-tag-remove"
                    aria-label={`Remove ${item.textValue}`}
                    onPress={() => handleRemoveTag(item.key)}
                  >
                    {renderIcon(icons?.removeTag ?? icons?.clear, 'clear', 'pd-combobox-tag-remove-icon')}
                  </FieldButton>
                </ButtonContext.Provider>
              )}
            </span>
          ))}
          <Input
            ref={inputRef}
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
            {...inputProps}
          />
        </div>
      ) : (
        <Input ref={inputRef} placeholder={placeholder} {...inputProps} />
      )}

      <span className="pd-field-actions">
        {showClear && (
          <FieldClearButton
            clearable={clearable}
            fallbackIcon={icons?.clear}
            onPress={handleClear}
          />
        )}
        <FieldButton>
          {renderIcon(icons?.chevron, 'chevronDown', 'pd-field-icon')}
        </FieldButton>
      </span>
    </FieldGroup>
  )
}

export interface ComboBoxProps<
  T extends object = object,
  M extends ComboBoxSelectionMode = 'single'
> extends Omit<AriaComboBoxProps<T, M>, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  placeholder?: string
  clearable?: ClearableProp
  onClear?: () => void
  icons?: ComboBoxIcons
  inputProps?: InputProps
  popoverProps?: ComboBoxPopoverProps
  listBoxProps?: AriaListBoxProps<T>
  children: ReactNode | ((item: T) => ReactNode)
}

export function ComboBox<
  T extends object = object,
  M extends ComboBoxSelectionMode = 'single'
>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  menuTrigger = 'focus',
  clearable,
  onClear,
  icons,
  inputProps,
  popoverProps,
  listBoxProps,
  className,
  children,
  items,
  ...props
}: ComboBoxProps<T, M>) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, false)

  return (
    <AriaComboBox<T, M>
      className={pdClass(className, 'pd-field')}
      menuTrigger={menuTrigger}
      items={items}
      {...ariaProps}
    >
      <FieldChrome
        label={label}
        description={description}
        errorMessage={errorMessage}
        afterError={(
          <ComboBoxPopover {...popoverProps}>
            <ComboBoxListBox {...listBoxProps}>
              {typeof children === 'function'
                ? children
                : (children as ReactNode)}
            </ComboBoxListBox>
          </ComboBoxPopover>
        )}
      >
        <ComboBoxControl
          size={size}
          placeholder={placeholder}
          selectionMode={ariaProps.selectionMode}
          isDisabled={ariaProps.isDisabled}
          isReadOnly={ariaProps.isReadOnly}
          clearable={resolvedClearable}
          onClear={onClear}
          icons={icons}
          inputProps={inputProps}
        />
      </FieldChrome>
    </AriaComboBox>
  )
}

export default ComboBox
