import { clsx } from 'clsx'
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'

export type SeparatorOrientation = 'horizontal' | 'vertical'
export type SeparatorTone = 'subtle' | 'default' | 'strong'

export interface SeparatorProps extends Omit<AriaSeparatorProps, 'orientation'> {
  orientation?: SeparatorOrientation
  tone?: SeparatorTone
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
      data-orientation={resolvedOrientation}
      data-tone={tone}
      className={clsx('pd-separator', className)}
      {...props}
    />
  )
}

export default Separator
