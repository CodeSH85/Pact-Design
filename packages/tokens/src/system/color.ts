import { ref, themed } from '../factory.ts'
import type { GlobalColorKey, GlobalRefPath } from '../global/index.ts'

type SystemSelfColorRef =
  | 'pd.system.color.surface.layer-2.$root'
  | 'pd.system.color.primary.$root'

export type SystemColorRef = GlobalColorKey | GlobalRefPath<'color'> | SystemSelfColorRef
type ResolvedColorRef = GlobalRefPath<'color'> | SystemSelfColorRef

function resolveColorRef(path: SystemColorRef): ResolvedColorRef {
  return (path.startsWith('pd.') ? path : `pd.global.color.${path}`) as ResolvedColorRef
}

export function color({ light, dark }: { light: SystemColorRef, dark: SystemColorRef }) {
  return themed(ref('color', resolveColorRef(light)), ref('color', resolveColorRef(dark)))
}

export const systemColor = {
  surface: {
    base: color({ light: 'gray.200', dark: 'gray.1200' }),
    'layer-1': {
      $root: color({ light: 'white', dark: 'gray.1100' }),
      hover: color({ light: 'gray.100', dark: 'gray.1000' }),
      active: color({ light: 'gray.200', dark: 'gray.900' }),
      selected: {
        $root: color({ light: 'gray.200', dark: 'gray.900' }),
        hover: color({ light: 'gray.300', dark: 'gray.800' })
      }
    },
    'layer-2': {
      $root: color({ light: 'gray.100', dark: 'gray.1000' }),
      hover: color({ light: 'gray.200', dark: 'gray.900' }),
      active: color({ light: 'gray.300', dark: 'gray.800' }),
      selected: {
        $root: color({ light: 'gray.200', dark: 'gray.800' }),
        hover: color({ light: 'gray.300', dark: 'gray.800' })
      }
    },
    elevated: color({
      light: 'pd.system.color.surface.layer-2.$root',
      dark: 'pd.system.color.surface.layer-2.$root'
    }),
    backdrop: color({ light: 'scrim.01', dark: 'scrim.02' }),
    hover: color({ light: 'gray.100', dark: 'gray.1000' }),
    active: color({ light: 'gray.200', dark: 'gray.900' }),
    selected: {
      $root: color({ light: 'gray.200', dark: 'gray.900' }),
      hover: color({ light: 'gray.300', dark: 'gray.800' })
    },
    disabled: color({ light: 'gray.200', dark: 'gray.1000' })
  },
  'on-surface': {
    $root: color({ light: 'gray.1100', dark: 'gray.200' }),
    secondary: color({ light: 'gray.900', dark: 'gray.300' }),
    muted: color({ light: 'gray.700', dark: 'gray.400' }),
    disabled: color({ light: 'gray.500', dark: 'gray.600' })
  },
  border: {
    $root: color({ light: 'gray.300', dark: 'gray.800' }),
    subtle: color({ light: 'gray.200', dark: 'gray.900' }),
    strong: color({ light: 'gray.500', dark: 'gray.400' }),
    focus: color({ light: 'pd.system.color.primary.$root', dark: 'indigo.400' })
  },
  primary: {
    $root: color({ light: 'indigo.600', dark: 'indigo.700' }),
    hover: color({ light: 'indigo.700', dark: 'indigo.600' }),
    active: color({ light: 'indigo.800', dark: 'indigo.800' }),
    subtle: color({ light: 'indigo.200', dark: 'indigo.1000' }),
    border: color({ light: 'indigo.300', dark: 'indigo.800' })
  },
  'on-primary': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'indigo.800', dark: 'indigo.300' })
  },
  secondary: {
    $root: color({ light: 'blue.700', dark: 'blue.700' }),
    hover: color({ light: 'blue.800', dark: 'blue.600' }),
    active: color({ light: 'blue.900', dark: 'blue.800' }),
    subtle: color({ light: 'blue.200', dark: 'blue.1000' }),
    border: color({ light: 'blue.300', dark: 'blue.800' })
  },
  'on-secondary': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'blue.800', dark: 'blue.300' })
  },
  success: {
    $root: color({ light: 'green.600', dark: 'green.700' }),
    hover: color({ light: 'green.700', dark: 'green.600' }),
    active: color({ light: 'green.800', dark: 'green.800' }),
    subtle: color({ light: 'green.200', dark: 'green.1000' }),
    border: color({ light: 'green.300', dark: 'green.800' })
  },
  'on-success': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'green.800', dark: 'green.300' })
  },
  danger: {
    $root: color({ light: 'red.600', dark: 'red.700' }),
    hover: color({ light: 'red.700', dark: 'red.600' }),
    active: color({ light: 'red.800', dark: 'red.800' }),
    subtle: color({ light: 'red.200', dark: 'red.1000' }),
    border: color({ light: 'red.300', dark: 'red.800' })
  },
  'on-danger': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'red.800', dark: 'red.300' })
  },
  warning: {
    $root: color({ light: 'orange.600', dark: 'orange.700' }),
    hover: color({ light: 'orange.700', dark: 'orange.600' }),
    active: color({ light: 'orange.800', dark: 'orange.800' }),
    subtle: color({ light: 'orange.200', dark: 'orange.1000' }),
    border: color({ light: 'orange.300', dark: 'orange.800' })
  },
  'on-warning': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'orange.800', dark: 'orange.300' })
  },
  info: {
    $root: color({ light: 'blue.600', dark: 'blue.700' }),
    hover: color({ light: 'blue.700', dark: 'blue.600' }),
    active: color({ light: 'blue.800', dark: 'blue.800' }),
    subtle: color({ light: 'blue.200', dark: 'blue.1000' }),
    border: color({ light: 'blue.300', dark: 'blue.800' })
  },
  'on-info': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'blue.800', dark: 'blue.300' })
  },
  neutral: {
    $root: color({ light: 'coolGray.700', dark: 'coolGray.700' }),
    hover: color({ light: 'coolGray.800', dark: 'coolGray.600' }),
    active: color({ light: 'coolGray.900', dark: 'coolGray.800' }),
    subtle: color({ light: 'coolGray.200', dark: 'coolGray.1000' }),
    border: color({ light: 'coolGray.300', dark: 'coolGray.800' })
  },
  'on-neutral': {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: 'coolGray.800', dark: 'coolGray.300' })
  },
  shadow: {
    xs: color({ light: 'shadow.01', dark: 'shadow.06' }),
    sm: color({ light: 'shadow.02', dark: 'shadow.07' }),
    md: color({ light: 'shadow.03', dark: 'shadow.08' }),
    lg: color({ light: 'shadow.04', dark: 'shadow.09' }),
    xl: color({ light: 'shadow.05', dark: 'shadow.10' })
  },
  util: {
    black: color({ light: 'black', dark: 'black' })
  }
} as const
