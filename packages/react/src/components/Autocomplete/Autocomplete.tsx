import { type ReactNode } from 'react'
import {
  Autocomplete as AriaAutocomplete,
  Button as AriaButton,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  SearchField as AriaSearchField,
  useFilter,
  type AutocompleteProps as AriaAutocompleteProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { RiCheckLine, RiCloseLine, RiSearchLine } from '@remixicon/react'
import { type VariantProps } from 'class-variance-authority'
import {
  cn,
  collectionItemVariants,
  composeTailwindRenderProps,
  fieldIconButtonClasses,
  fieldInputClasses,
  fieldWrapperClasses,
  listBoxClasses,
  type FieldSharedProps
} from '../../utils/index.ts'
import { FieldDescription, FieldError, FieldGroup, fieldGroupVariants, Label } from '../Field/index.ts'

export interface AutocompleteItemProps extends AriaListBoxItemProps {
  className?: string
  children?: ReactNode | AriaListBoxItemProps['children']
}

export function AutocompleteItem({ className, children, ...props }: AutocompleteItemProps) {
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
        <AriaInput
          placeholder={placeholder}
          className={fieldInputClasses}
        />
        <AriaButton className={cn(fieldIconButtonClasses, 'group-data-[empty]:hidden')}>
          <RiCloseLine className="w-icon-xs h-icon-xs" aria-hidden="true" />
        </AriaButton>
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
  className,
  children,
  ...props
}: AutocompleteListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(
        className,
        listBoxClasses,
        'bg-layer-1 border border-border-default rounded-sm shadow-elevation-sm'
      )}
      {...props}
    >
      {children}
    </AriaListBox>
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
