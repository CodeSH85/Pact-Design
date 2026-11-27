import { type HTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

export type BadgeTone = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
export type BadgeVariant = 'subtle' | 'solid' | 'outline'
export type BadgeSize = 'xs' | 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  variant?: BadgeVariant
  size?: BadgeSize
  children?: ReactNode
}

export function Badge({
  tone = 'default',
  variant = 'subtle',
  size = 'sm',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      className={clsx('pd-badge', className)}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
