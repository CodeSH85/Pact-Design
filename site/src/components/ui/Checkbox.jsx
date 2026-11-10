import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'

export function Checkbox({
  label,
  description,
  disabled = false,
  className = '',
  ...props
}) {
  const boxClasses = [
    'inline-flex shrink-0 items-center justify-center',
    'w-icon-md h-icon-md rounded-xs',
    'border border-border-strong bg-layer-1 text-on-primary',
    'transition-colors duration-fast ease-default cursor-pointer',
    'hover:border-primary',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
    'data-[checked]:bg-primary data-[checked]:border-primary',
    'data-[indeterminate]:bg-primary data-[indeterminate]:border-primary',
    'data-[disabled]:bg-disabled data-[disabled]:border-border-subtle data-[disabled]:text-on-surface-disabled',
    'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
  ].join(' ')

  return (
    <label
      className={`inline-flex items-start gap-xs select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`.trim()}
    >
      <BaseCheckbox.Root
        disabled={disabled}
        className={boxClasses}
        {...props}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center text-caption-sm leading-none">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="w-icon-xs h-icon-xs stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 6L5 8.5L9.5 3.5" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>

      {(label || description) && (
        <span className="flex flex-col gap-3xs">
          {label && (
            <span className={`text-label-md leading-tight ${disabled ? 'text-on-surface-disabled' : 'text-on-surface'}`}>
              {label}
            </span>
          )}
          {description && (
            <span className={`text-caption-md ${disabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'}`}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}
