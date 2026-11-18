import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { RiCloseLine, RiSearchLine } from '@remixicon/react'
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

export interface SearchFieldProps
  extends Omit<AriaSearchFieldProps, 'children'>,
  VariantProps<typeof fieldGroupVariants>,
  FieldSharedProps {
  placeholder?: string
  className?: string
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder = 'Search...',
  size = 'md',
  className,
  ...props
}: SearchFieldProps) {
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

export default SearchField
