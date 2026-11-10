import { Button as BaseButton } from '@base-ui/react/button'

const VARIANT_CLASSES = {
  primary: [
    'bg-primary text-on-primary border border-transparent',
    'hover:bg-primary-hover active:bg-primary-active'
  ].join(' '),
  secondary: [
    'bg-layer-1 text-on-surface border border-border-default',
    'hover:bg-layer-1-hover active:bg-layer-1-active'
  ].join(' '),
  ghost: [
    'bg-transparent text-on-surface border border-transparent',
    'hover:bg-hover active:bg-active'
  ].join(' '),
  danger: [
    'bg-danger text-on-danger border border-transparent',
    'hover:bg-danger-hover active:bg-danger-active'
  ].join(' '),
  subtle: [
    'bg-info-subtle text-on-info-subtle border border-info-border',
    'hover:bg-layer-2-hover active:bg-layer-2-active'
  ].join(' ')
}

const SIZE_CLASSES = {
  xs: 'h-control-xs px-xs gap-2xs text-label-xs rounded-xs',
  sm: 'h-control-sm px-sm gap-xs text-label-sm rounded-sm',
  md: 'h-control-md px-md gap-xs text-label-md rounded-sm',
  lg: 'h-control-lg px-lg gap-sm text-label-lg rounded-md',
  xl: 'h-control-xl px-xl gap-sm text-label-xl rounded-md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const baseClasses = [
    'inline-flex items-center justify-center select-none cursor-pointer',
    'transition-colors duration-fast ease-default',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
    'data-[disabled]:bg-disabled data-[disabled]:text-on-surface-disabled data-[disabled]:border-transparent',
    'data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
  ].join(' ')

  const resolvedVariant = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  const resolvedSize = SIZE_CLASSES[size] || SIZE_CLASSES.md

  return (
    <BaseButton
      className={`${baseClasses} ${resolvedVariant} ${resolvedSize} ${className}`.trim()}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
