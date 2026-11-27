import { type CSSProperties, type ReactNode } from 'react'
import {
  Slider as AriaSlider,
  SliderFill as AriaSliderFill,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  type SliderFillProps as AriaSliderFillProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type SliderProps as AriaSliderProps,
  type SliderThumbProps as AriaSliderThumbProps,
  type SliderTrackProps as AriaSliderTrackProps
} from 'react-aria-components'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisableableProps,
  type DisableableProps
} from '../../utils/index.ts'
import { FieldDescription, Label } from '../Field/index.ts'

export type SliderSize = 'sm' | 'md'

export type SliderTrackProps = AriaSliderTrackProps

export function SliderTrack({ className, ...props }: SliderTrackProps) {
  return (
    <AriaSliderTrack
      className={pdClass(className, 'pd-slider-track')}
      {...props}
    />
  )
}

export type SliderFillProps = AriaSliderFillProps

export function SliderFill({ className, ...props }: SliderFillProps) {
  return (
    <AriaSliderFill
      className={pdClass(className, 'pd-slider-fill')}
      {...props}
    />
  )
}

export type SliderThumbProps = AriaSliderThumbProps

export function SliderThumb({ className, ...props }: SliderThumbProps) {
  return (
    <AriaSliderThumb
      className={pdClass(className, 'pd-slider-thumb')}
      {...props}
    />
  )
}

export type SliderOutputProps = AriaSliderOutputProps

export function SliderOutput({ className, ...props }: SliderOutputProps) {
  return (
    <AriaSliderOutput
      className={pdClass(className, 'pd-slider-output')}
      {...props}
    />
  )
}

export interface SliderProps<T extends number | number[] = number>
  extends Omit<AriaSliderProps<T>, 'children'>,
  DisableableProps {
  label?: ReactNode
  description?: ReactNode
  size?: SliderSize
  showValue?: boolean
  showFill?: boolean
  fillOffset?: number
  trackClassName?: string
  trackStyle?: CSSProperties
  children?: ReactNode | AriaSliderProps<T>['children']
}

export function Slider<T extends number | number[] = number>({
  label,
  description,
  size = 'md',
  showValue = false,
  showFill = true,
  fillOffset,
  trackClassName,
  trackStyle,
  className,
  children,
  ...props
}: SliderProps<T>) {
  const ariaProps = resolveDisableableProps(props)
  const thumbSeed = ariaProps.value ?? ariaProps.defaultValue
  const thumbCount = Array.isArray(thumbSeed) ? thumbSeed.length : 1

  return (
    <AriaSlider
      {...dataAttrs({ size })}
      className={pdClass(className, 'pd-slider')}
      {...ariaProps}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {(label || showValue) && (
            <div className="pd-slider-header">
              {label && <Label>{label}</Label>}
              {showValue && <SliderOutput />}
            </div>
          )}

          <SliderTrack className={trackClassName} style={trackStyle}>
            {({ orientation, isDisabled: trackDisabled }) => (
              <>
                {showFill && (
                  <SliderFill
                    offset={fillOffset}
                    data-orientation={orientation}
                    data-disabled={trackDisabled || undefined}
                  />
                )}
                {Array.from({ length: thumbCount }, (_, idx) => (
                  <SliderThumb
                    key={idx}
                    index={idx}
                    data-orientation={orientation}
                    data-disabled={trackDisabled || undefined}
                  />
                ))}
              </>
            )}
          </SliderTrack>

          {description && <FieldDescription>{description}</FieldDescription>}
        </>
      )}
    </AriaSlider>
  )
}

export default Slider
