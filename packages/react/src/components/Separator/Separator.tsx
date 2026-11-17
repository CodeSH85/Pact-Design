import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/index.ts'

export const separatorVariants = cva('border-0 shrink-0', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'w-px h-full self-stretch'
    },
    tone: {
      subtle: 'bg-border-subtle',
      default: 'bg-border-default',
      strong: 'bg-border-strong'
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    tone: 'subtle'
  }
})

export interface SeparatorProps
  extends Omit<AriaSeparatorProps, 'orientation'>,
  VariantProps<typeof separatorVariants> {
  className?: string
}

export function Separator({
  orientation = 'horizontal',
  tone = 'subtle',
  className,
  ...props
}: SeparatorProps) {
  const resolvedOrientation = orientation ?? 'horizontal'

  return (
    <AriaSeparator
      orientation={resolvedOrientation}
      className={cn(separatorVariants({ orientation: resolvedOrientation, tone }), className)}
      {...props}
    />
  )
}

export default Separator
