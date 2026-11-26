import { clsx } from 'clsx'
import {
  composeRenderProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  Label
} from '../Field/index.ts'

export interface SearchFieldIcons {
  search?: IconSlot
  clear?: IconSlot
}

export interface SearchFieldProps
  extends Omit<AriaSearchFieldProps, 'children'>,
  FieldSharedProps,
  DisableableProps {
  size?: FieldSize
  placeholder?: string
  clearable?: ClearableProp
  icons?: SearchFieldIcons
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder = 'Search...',
  size = 'md',
  clearable,
  icons,
  onClear,
  className,
  ...props
}: SearchFieldProps) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedClearable = resolveClearable(clearable, true)

  const handleClear = () => {
    onClear?.()
    resolvedClearable.onClear?.()
  }

  return (
    <AriaSearchField
      className={composeRenderProps(className, (cn) => clsx('pd-field', 'pd-search-field', cn))}
      onClear={handleClear}
      {...ariaProps}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup
        size={size}
        className={clsx(resolvedClearable.enabled && 'pd-field-group-compact-end')}
      >
        {renderIcon(icons?.search, 'search', 'pd-search-field-icon')}
        <Input placeholder={placeholder} />
        {resolvedClearable.enabled && (
          <FieldButton
            className="pd-search-field-clear pd-field-clear"
            aria-label={resolvedClearable.label}
          >
            {renderIcon(resolvedClearable.icon ?? icons?.clear, 'clear', 'pd-field-icon')}
          </FieldButton>
        )}
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  )
}

export default SearchField
