import { type ReactNode } from 'react'
import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps as AriaFileTriggerProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { resolveDisabled, type DisableableProps } from '../../utils/index.ts'
import { Button, type ButtonProps } from '../Button/index.ts'

export interface FileTriggerIcons {
  upload?: IconSlot
}

export interface FileTriggerProps
  extends AriaFileTriggerProps,
  DisableableProps {
  label?: ReactNode
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  icon?: IconSlot
  icons?: FileTriggerIcons
  children?: ReactNode
}

export function FileTrigger({
  label,
  variant = 'secondary',
  size = 'md',
  icon,
  icons,
  disabled,
  isDisabled,
  children,
  ...props
}: FileTriggerProps) {
  const resolvedDisabled = resolveDisabled({ disabled, isDisabled })

  return (
    <AriaFileTrigger {...props}>
      {children ?? (
        <Button variant={variant} size={size} isDisabled={resolvedDisabled}>
          {renderIcon(icon ?? icons?.upload, 'upload', 'pd-field-icon')}
          <span>{label ?? 'Choose file'}</span>
        </Button>
      )}
    </AriaFileTrigger>
  )
}

export default FileTrigger
