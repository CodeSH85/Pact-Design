import { type ReactNode } from 'react'
import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps as AriaFileTriggerProps
} from 'react-aria-components'
import { RiUpload2Line } from '@remixicon/react'
import { Button, type ButtonProps } from '../Button/index.ts'

export interface FileTriggerProps extends AriaFileTriggerProps {
  label?: ReactNode
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  icon?: ReactNode
  children?: ReactNode
}

export function FileTrigger({
  label,
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  ...props
}: FileTriggerProps) {
  return (
    <AriaFileTrigger {...props}>
      {children ?? (
        <Button variant={variant} size={size}>
          {icon ?? <RiUpload2Line className="w-icon-xs h-icon-xs" aria-hidden="true" />}
          <span>{label ?? 'Choose file'}</span>
        </Button>
      )}
    </AriaFileTrigger>
  )
}

export default FileTrigger
