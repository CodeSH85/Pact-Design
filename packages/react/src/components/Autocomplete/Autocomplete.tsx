import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Autocomplete as AriaAutocomplete,
  useFilter,
  type AutocompleteProps as AriaAutocompleteProps,
  type ListBoxProps as AriaListBoxProps
} from 'react-aria-components'
import {
  resolveDisabled,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps
} from '../../utils/index.ts'
import { type FieldSize } from '../Field/index.ts'
import { ListBox, ListBoxItem, type ListBoxItemProps } from '../ListBox/index.ts'
import {
  SearchField,
  type SearchFieldIcons,
  type SearchFieldProps
} from '../SearchField/index.ts'

export type AutocompleteItemProps = ListBoxItemProps

export function AutocompleteItem(props: AutocompleteItemProps) {
  return <ListBoxItem {...props} />
}

export type AutocompleteSearchFieldProps = SearchFieldProps

export function AutocompleteSearchField(props: AutocompleteSearchFieldProps) {
  return <SearchField {...props} />
}

export interface AutocompleteListBoxProps<T extends object = object> extends AriaListBoxProps<T> {
  className?: string
}

export function AutocompleteListBox<T extends object = object>({
  children,
  ...props
}: AutocompleteListBoxProps<T>) {
  return (
    <ListBox surface="bordered" {...props}>
      {children}
    </ListBox>
  )
}

export type AutocompleteIcons = SearchFieldIcons

export interface AutocompleteProps<T extends object = object>
  extends Omit<AriaAutocompleteProps<T>, 'children'>,
  Pick<
    AutocompleteListBoxProps<T>,
    | 'selectionMode'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'disallowEmptySelection'
    | 'onAction'
  >,
  FieldSharedProps,
  DisableableProps {
  placeholder?: string
  size?: FieldSize
  clearable?: ClearableProp
  onClear?: () => void
  icons?: AutocompleteIcons
  searchFieldProps?: Partial<AutocompleteSearchFieldProps>
  listBoxProps?: Partial<AutocompleteListBoxProps<T>>
  className?: string
  children?: ReactNode
}

export function Autocomplete<T extends object = object>({
  filter,
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  clearable,
  onClear,
  icons,
  disabled,
  isDisabled,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disallowEmptySelection,
  onAction,
  searchFieldProps,
  listBoxProps,
  className,
  children,
  ...props
}: AutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const resolvedFilter = filter ?? contains
  const resolvedDisabled = resolveDisabled({ disabled, isDisabled })

  const mergedListBoxProps: Partial<AutocompleteListBoxProps<T>> = {
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disallowEmptySelection,
    onAction,
    ...listBoxProps
  }

  return (
    <div
      className={clsx('pd-field', className)}
      data-disabled={resolvedDisabled ? '' : undefined}
    >
      <AriaAutocomplete filter={resolvedFilter} {...props}>
        {label || placeholder || searchFieldProps ? (
          <>
            <AutocompleteSearchField
              label={label}
              description={description}
              errorMessage={errorMessage}
              placeholder={placeholder}
              size={size}
              clearable={clearable}
              onClear={onClear}
              icons={icons}
              isDisabled={resolvedDisabled}
              {...searchFieldProps}
            />
            <AutocompleteListBox {...mergedListBoxProps}>
              {children}
            </AutocompleteListBox>
          </>
        ) : (
          children
        )}
      </AriaAutocomplete>
    </div>
  )
}

export { useFilter }
export default Autocomplete
