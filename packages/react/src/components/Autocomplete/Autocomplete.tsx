import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Autocomplete as AriaAutocomplete,
  useFilter,
  type AutocompleteProps as AriaAutocompleteProps,
  type ListBoxProps as AriaListBoxProps
} from 'react-aria-components'
import { type FieldSharedProps } from '../../utils/index.ts'
import { type FieldSize } from '../Field/index.ts'
import { ListBox, ListBoxItem, type ListBoxItemProps } from '../ListBox/index.ts'
import { SearchField, type SearchFieldProps } from '../SearchField/index.ts'

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

export interface AutocompleteProps<T extends object = object>
  extends Omit<AriaAutocompleteProps<T>, 'children'>,
  FieldSharedProps {
  placeholder?: string
  size?: FieldSize
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
  searchFieldProps,
  listBoxProps,
  className,
  children,
  ...props
}: AutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const resolvedFilter = filter ?? contains

  return (
    <div className={clsx('pd-field', className)}>
      <AriaAutocomplete filter={resolvedFilter} {...props}>
        {label || placeholder || searchFieldProps ? (
          <>
            <AutocompleteSearchField
              label={label}
              description={description}
              errorMessage={errorMessage}
              placeholder={placeholder}
              size={size}
              {...searchFieldProps}
            />
            <AutocompleteListBox {...listBoxProps}>
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
