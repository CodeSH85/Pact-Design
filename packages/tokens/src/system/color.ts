import { ref, themed } from '../dsl/index.ts'
import type { GlobalRefPath, GlobalShortRefPath } from '../global/index.ts'

type SystemSelfColorRef = 'system.background.layer-2' | 'system.semantic.primary'
export type SystemColorRef = GlobalShortRefPath<'color'> | GlobalRefPath<'color'> | SystemSelfColorRef
type ResolvedColorRef = GlobalRefPath<'color'> | SystemSelfColorRef

function resolveColorRef(path: SystemColorRef): ResolvedColorRef {
  return (
    path.startsWith('global.') || path.startsWith('system.') ? path : `global.${path}`
  ) as ResolvedColorRef
}

export function color({ light, dark }: { light: SystemColorRef, dark: SystemColorRef }) {
  return themed(ref('color', resolveColorRef(light)), ref('color', resolveColorRef(dark)))
}

export const systemColor = {
  background: {
    base: color({ light: 'gray.200', dark: 'gray.1200' }),
    'layer-1': color({ light: 'white', dark: 'gray.1100' }),
    'layer-1-hover': color({ light: 'gray.100', dark: 'gray.1000' }),
    'layer-1-active': color({ light: 'gray.200', dark: 'gray.900' }),
    'layer-1-selected': color({ light: 'gray.200', dark: 'gray.900' }),
    'layer-1-selected-hover': color({ light: 'gray.300', dark: 'gray.800' }),
    'layer-2': color({ light: 'gray.100', dark: 'gray.1000' }),
    'layer-2-hover': color({ light: 'gray.200', dark: 'gray.900' }),
    'layer-2-active': color({ light: 'gray.300', dark: 'gray.800' }),
    'layer-2-selected': color({ light: 'gray.200', dark: 'gray.800' }),
    'layer-2-selected-hover': color({ light: 'gray.300', dark: 'gray.800' }),
    elevated: color({ light: 'system.background.layer-2', dark: 'system.background.layer-2' }),
    backdrop: color({ light: 'scrim.01', dark: 'scrim.02' }),
    hover: color({ light: 'gray.100', dark: 'gray.1000' }),
    active: color({ light: 'gray.200', dark: 'gray.900' }),
    selected: color({ light: 'gray.200', dark: 'gray.900' }),
    'selected-hover': color({ light: 'gray.300', dark: 'gray.800' }),
    disabled: color({ light: 'gray.200', dark: 'gray.1000' })
  },
  'on-surface': {
    default: color({ light: 'gray.1100', dark: 'gray.200' }),
    secondary: color({ light: 'gray.900', dark: 'gray.300' }),
    muted: color({ light: 'gray.700', dark: 'gray.400' }),
    disabled: color({ light: 'gray.500', dark: 'gray.600' })
  },
  border: {
    subtle: color({ light: 'gray.200', dark: 'gray.900' }),
    default: color({ light: 'gray.300', dark: 'gray.800' }),
    strong: color({ light: 'gray.500', dark: 'gray.400' }),
    focus: color({ light: 'system.semantic.primary', dark: 'indigo.400' })
  },
  semantic: {
    primary: color({ light: 'indigo.600', dark: 'indigo.700' }),
    'primary-hover': color({ light: 'indigo.700', dark: 'indigo.600' }),
    'primary-active': color({ light: 'indigo.800', dark: 'indigo.800' }),
    'on-primary': color({ light: 'white', dark: 'white' }),
    'primary-subtle': color({ light: 'indigo.200', dark: 'indigo.1000' }),
    'on-primary-subtle': color({ light: 'indigo.800', dark: 'indigo.300' }),
    'primary-border': color({ light: 'indigo.300', dark: 'indigo.800' }),

    secondary: color({ light: 'blue.700', dark: 'blue.700' }),
    'secondary-hover': color({ light: 'blue.800', dark: 'blue.600' }),
    'secondary-active': color({ light: 'blue.900', dark: 'blue.800' }),
    'on-secondary': color({ light: 'white', dark: 'white' }),
    'secondary-subtle': color({ light: 'blue.200', dark: 'blue.1000' }),
    'on-secondary-subtle': color({ light: 'blue.800', dark: 'blue.300' }),
    'secondary-border': color({ light: 'blue.300', dark: 'blue.800' }),

    success: color({ light: 'green.600', dark: 'green.700' }),
    'success-hover': color({ light: 'green.700', dark: 'green.600' }),
    'success-active': color({ light: 'green.800', dark: 'green.800' }),
    'on-success': color({ light: 'white', dark: 'white' }),
    'success-subtle': color({ light: 'green.200', dark: 'green.1000' }),
    'on-success-subtle': color({ light: 'green.800', dark: 'green.300' }),
    'success-border': color({ light: 'green.300', dark: 'green.800' }),

    danger: color({ light: 'red.600', dark: 'red.700' }),
    'danger-hover': color({ light: 'red.700', dark: 'red.600' }),
    'danger-active': color({ light: 'red.800', dark: 'red.800' }),
    'on-danger': color({ light: 'white', dark: 'white' }),
    'danger-subtle': color({ light: 'red.200', dark: 'red.1000' }),
    'on-danger-subtle': color({ light: 'red.800', dark: 'red.300' }),
    'danger-border': color({ light: 'red.300', dark: 'red.800' }),

    warning: color({ light: 'orange.600', dark: 'orange.700' }),
    'warning-hover': color({ light: 'orange.700', dark: 'orange.600' }),
    'warning-active': color({ light: 'orange.800', dark: 'orange.800' }),
    'on-warning': color({ light: 'white', dark: 'white' }),
    'warning-subtle': color({ light: 'orange.200', dark: 'orange.1000' }),
    'on-warning-subtle': color({ light: 'orange.800', dark: 'orange.300' }),
    'warning-border': color({ light: 'orange.300', dark: 'orange.800' }),

    info: color({ light: 'blue.600', dark: 'blue.700' }),
    'info-hover': color({ light: 'blue.700', dark: 'blue.600' }),
    'info-active': color({ light: 'blue.800', dark: 'blue.800' }),
    'on-info': color({ light: 'white', dark: 'white' }),
    'info-subtle': color({ light: 'blue.200', dark: 'blue.1000' }),
    'on-info-subtle': color({ light: 'blue.800', dark: 'blue.300' }),
    'info-border': color({ light: 'blue.300', dark: 'blue.800' }),

    neutral: color({ light: 'coolGray.700', dark: 'coolGray.700' }),
    'neutral-hover': color({ light: 'coolGray.800', dark: 'coolGray.600' }),
    'neutral-active': color({ light: 'coolGray.900', dark: 'coolGray.800' }),
    'on-neutral': color({ light: 'white', dark: 'white' }),
    'neutral-subtle': color({ light: 'coolGray.200', dark: 'coolGray.1000' }),
    'on-neutral-subtle': color({ light: 'coolGray.800', dark: 'coolGray.300' }),
    'neutral-border': color({ light: 'coolGray.300', dark: 'coolGray.800' })
  },
  util: {
    black: color({ light: 'black', dark: 'black' }),
    white: color({ light: 'white', dark: 'white' })
  }
} as const
