import { type ReactNode } from 'react'
import {
  Autocomplete as AriaAutocomplete,
  SearchField as AriaSearchField,
  useFilter,
  type AutocompleteProps as AriaAutocompleteProps,
  type ListBoxProps as AriaListBoxProps,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { RiCloseLine, RiSearchLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  cn,
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
import { ListBox, ListBoxItem, type ListBoxItemProps } from '../ListBox/index.ts'

export type AutocompleteItemProps = ListBoxItemProps

export function AutocompleteItem(props: AutocompleteItemProps) {
  return <ListBoxItem {...props} />
}

export interface AutocompleteSearchFieldProps
  extends Omit<AriaSearchFieldProps, 'children'>,
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  placeholder?: string
  className?: string
}

export function AutocompleteSearchField({
  label,
  description,
  errorMessage,
  placeholder = 'Search...',
  size = 'md',
  className,
  ...props
}: AutocompleteSearchFieldProps) {
  return (
    <AriaSearchField
      className={composeTailwindRenderProps(className, 'group', fieldWrapperClasses)}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup size={size} className="gap-xs">
        <RiSearchLine className="w-icon-xs h-icon-xs text-field-text-muted shrink-0" aria-hidden="true" />
        <Input placeholder={placeholder} />
        <FieldButton className="group-data-[empty]:hidden">
          <RiCloseLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
        </FieldButton>
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  )
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
  size?: VariantProps<typeof fieldGroupVariants>['size']
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
    <div className={cn(fieldWrapperClasses, className)}>
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
