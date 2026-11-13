import { clsx, type ClassValue } from 'clsx'
import { composeRenderProps } from 'react-aria-components'
import { extendTailwindMerge } from 'tailwind-merge'
import { pactTheme } from '@pact-design/tokens/uno'

const colorKeys = Object.keys(pactTheme.colors)
const fontSizeKeys = Object.keys(pactTheme.fontSize)
const spacingKeys = Object.keys(pactTheme.spacing)
const widthKeys = Object.keys(pactTheme.width)
const heightKeys = Object.keys(pactTheme.height)
const minHeightKeys = Object.keys(pactTheme.minHeight)
const radiusKeys = Object.keys(pactTheme.borderRadius)
const borderWidthKeys = Object.keys(pactTheme.borderWidth)
const shadowKeys = Object.keys(pactTheme.boxShadow)
const zIndexKeys = Object.keys(pactTheme.zIndex)
const durationKeys = Object.keys(pactTheme.duration)
const easingKeys = Object.keys(pactTheme.easing)

export const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: spacingKeys
    },
    classGroups: {
      'font-size': [{ text: fontSizeKeys }],
      'text-color': [{ text: colorKeys }],
      'bg-color': [{ bg: colorKeys }],
      'border-color': [{ border: colorKeys }],
      'outline-color': [{ outline: colorKeys }],
      'border-w': [{ border: borderWidthKeys }],
      rounded: [{ rounded: radiusKeys }],
      shadow: [{ shadow: shadowKeys }],
      w: [{ w: widthKeys }],
      h: [{ h: heightKeys }],
      'min-h': [{ 'min-h': minHeightKeys }],
      z: [{ z: zIndexKeys }],
      duration: [{ duration: durationKeys }],
      ease: [{ ease: easingKeys }]
    }
  }
})

/**
 * Conditionally joins class names and resolves Pact Design + Tailwind/UnoCSS utility conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs))
}

/**
 * Composes React Aria render-prop className functions with Pact Design utility classes.
 */
export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  ...tw: ClassValue[]
): string | ((v: T) => string) {
  const base = cn(...tw)
  return composeRenderProps(className, (cnValue) => cn(base, cnValue))
}
