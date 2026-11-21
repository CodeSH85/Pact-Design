import { clsx } from 'clsx'
import {
  composeRenderProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { RiCloseLine, RiSearchLine } from '@remixicon/react'
import { type FieldSharedProps } from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  Label
} from '../Field/index.ts'

export interface SearchFieldProps
  extends Omit<AriaSearchFieldProps, 'children'>,
  FieldSharedProps {
  size?: FieldSize
  placeholder?: string
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
      className={composeRenderProps(className, (cn) => clsx('pd-field', 'pd-search-field', cn))}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup size={size}>
        <RiSearchLine className="pd-search-field-icon" aria-hidden="true" />
        <Input placeholder={placeholder} />
        <FieldButton className="pd-search-field-clear">
          <RiCloseLine className="pd-field-icon" aria-hidden="true" />
        </FieldButton>
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  )
}

export default SearchField
