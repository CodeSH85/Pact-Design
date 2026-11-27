import { clsx } from 'clsx'
import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { FieldChrome, FieldClearButton, pdClass } from '../../internal/index.ts'
import {
  resolveClearable,
  resolveDisableableProps,
  type ClearableProp,
  type DisableableProps,
  type FieldSharedProps
} from '../../utils/index.ts'
import {
  FieldGroup,
  type FieldSize,
  Input
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
      className={pdClass(className, 'pd-field', 'pd-search-field')}
      onClear={handleClear}
      {...ariaProps}
    >
      <FieldChrome label={label} description={description} errorMessage={errorMessage}>
        <FieldGroup
          size={size}
          className={clsx(resolvedClearable.enabled && 'pd-field-group-compact-end')}
        >
          {renderIcon(icons?.search, 'search', 'pd-search-field-icon')}
          <Input placeholder={placeholder} />
          {resolvedClearable.enabled && (
            <FieldClearButton
              clearable={resolvedClearable}
              fallbackIcon={icons?.clear}
              className="pd-search-field-clear"
              isolated={false}
            />
          )}
        </FieldGroup>
      </FieldChrome>
    </AriaSearchField>
  )
}

export default SearchField
