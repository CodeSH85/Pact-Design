import { type ReactNode } from 'react'
import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps
} from 'react-aria-components'
import { pdClass } from '../../internal/index.ts'
import { resolveDisableableProps, type DisableableProps } from '../../utils/index.ts'

export interface TooltipTriggerProps
  extends AriaTooltipTriggerProps,
  DisableableProps {}

export function TooltipTrigger({
  delay = 300,
  closeDelay = 0,
  ...props
}: TooltipTriggerProps) {
  const ariaProps = resolveDisableableProps(props)
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...ariaProps} />
}

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  showArrow?: boolean
  children?: ReactNode | AriaTooltipProps['children']
}

export function Tooltip({
  offset = 6,
  showArrow = false,
  className,
  children,
  ...props
}: TooltipProps) {
  return (
    <AriaTooltip
      offset={offset}
      className={pdClass(className, 'pd-reset', 'pd-tooltip')}
      {...props}
    >
      {(renderProps) => (
        <>
          {showArrow && (
            <AriaOverlayArrow className="pd-tooltip-arrow">
              <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true">
                <path d="M0 0 L4 4 L8 0" />
              </svg>
            </AriaOverlayArrow>
          )}
          {typeof children === 'function' ? children(renderProps) : children}
        </>
      )}
    </AriaTooltip>
  )
}

export default Tooltip
