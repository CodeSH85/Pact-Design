import { Checkbox as AriaCheckbox } from 'react-aria-components'

export function Checkbox({
  label,
  description,
  checked,
  isSelected,
  defaultChecked,
  defaultSelected,
  disabled = false,
  isDisabled,
  onCheckedChange,
  onChange,
  className = '',
  ...props
}) {
  const resolvedDisabled = isDisabled ?? disabled

  const boxClasses = [
    'inline-flex shrink-0 items-center justify-center',
    'w-icon-md h-icon-md rounded-xs',
    'border border-border-strong bg-layer-1 text-on-primary',
    'transition-colors duration-fast ease-default',
    'group-hover:border-primary group-data-[hovered]:border-primary',
    'group-data-[focus-visible]:outline group-data-[focus-visible]:outline-2 group-data-[focus-visible]:outline-border-focus group-data-[focus-visible]:outline-offset-2',
    'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
    'group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary',
    'group-data-[disabled]:bg-disabled group-data-[disabled]:border-border-subtle group-data-[disabled]:text-on-surface-disabled'
  ].join(' ')

  return (
    <AriaCheckbox
      isSelected={isSelected ?? checked}
      defaultSelected={defaultSelected ?? defaultChecked}
      isDisabled={resolvedDisabled}
      onChange={onChange ?? onCheckedChange}
      className={`group inline-flex items-start gap-xs select-none outline-none ${resolvedDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`.trim()}
      {...props}
    >
      {({ isSelected: selected, isIndeterminate }) => (
        <>
          <span className={boxClasses}>
            {(selected || isIndeterminate) && (
              <svg
                viewBox="0 0 12 12"
                fill="none"
                className="w-icon-xs h-icon-xs stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {isIndeterminate
                  ? <path d="M2.5 6H9.5" />
                  : <path d="M2.5 6L5 8.5L9.5 3.5" />}
              </svg>
            )}
          </span>

          {(label || description) && (
            <span className="flex flex-col gap-3xs">
              {label && (
                <span className={`text-label-md leading-tight ${resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface'}`}>
                  {label}
                </span>
              )}
              {description && (
                <span className={`text-caption-md ${resolvedDisabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'}`}>
                  {description}
                </span>
              )}
            </span>
          )}
        </>
      )}
    </AriaCheckbox>
  )
}
