import { oklch, ref, themed, type DtcgToken, type OklchColorValue } from '../factory.ts'
import { globalColor } from '../global/color.ts'
import { globalOpacity } from '../global/opacity.ts'
import type { GlobalColorKey, GlobalOpacityKey, GlobalRefPath } from '../global/index.ts'

type SystemSelfColorRef =
  | 'pd.system.color.surface.layer-2.$root'
  | 'pd.system.color.primary.border.strong'
  | 'pd.system.color.danger.border.strong'

export type SystemColorRef = GlobalColorKey | GlobalRefPath<'color'> | SystemSelfColorRef
type ResolvedColorRef = GlobalRefPath<'color'> | SystemSelfColorRef
export type SystemColorInput = SystemColorRef | DtcgToken<'color', OklchColorValue>

function resolveColorRef(path: SystemColorRef): ResolvedColorRef {
  return (path.startsWith('pd.') ? path : `pd.global.color.${path}`) as ResolvedColorRef
}

function lookupGlobalColor(key: GlobalColorKey): DtcgToken<'color', OklchColorValue> {
  const parts = key.split('.')
  let cur: unknown = globalColor
  for (const part of parts) {
    cur = (cur as Record<string, unknown>)[part]
  }
  return cur as DtcgToken<'color', OklchColorValue>
}

/**
 * Derives a build-time DTCG OKLCH color token with an alpha channel from `globalOpacity`.
 * Emits a concrete `oklch(L C H / alpha)` literal compatible with older CSS targets and contrast tools.
 */
export function alpha(
  colorKey: GlobalColorKey,
  opacityKey: GlobalOpacityKey
): DtcgToken<'color', OklchColorValue> {
  const [l, c, h] = lookupGlobalColor(colorKey).$value.components
  return oklch(l, c, h, globalOpacity[opacityKey].$value)
}

function toColorToken(input: SystemColorInput) {
  return typeof input === 'string' ? ref('color', resolveColorRef(input)) : input
}

export function color({ light, dark }: { light: SystemColorInput, dark: SystemColorInput }) {
  return themed(toColorToken(light), toColorToken(dark))
}

type HuePalette = 'indigo' | 'blue' | 'green' | 'red' | 'orange' | 'coolGray'
type Stop = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000'

function semanticScale(
  hue: HuePalette,
  solidLight: readonly [Stop, Stop, Stop] = ['600', '700', '800']
) {
  const [lRoot, lHover, lActive] = solidLight
  return {
    $root: color({ light: `${hue}.${lRoot}`, dark: `${hue}.700` }),
    hover: color({ light: `${hue}.${lHover}`, dark: `${hue}.600` }),
    active: color({ light: `${hue}.${lActive}`, dark: `${hue}.800` }),
    subtle: {
      $root: color({ light: `${hue}.100`, dark: `${hue}.1000` }),
      hover: color({ light: `${hue}.200`, dark: `${hue}.900` }),
      active: color({ light: `${hue}.300`, dark: `${hue}.800` })
    },
    text: {
      $root: color({ light: `${hue}.700`, dark: `${hue}.400` }),
      hover: color({ light: `${hue}.800`, dark: `${hue}.300` }),
      active: color({ light: `${hue}.900`, dark: `${hue}.200` })
    },
    border: {
      $root: color({ light: `${hue}.300`, dark: `${hue}.800` }),
      strong: color({ light: `${hue}.600`, dark: `${hue}.400` })
    }
  } as const
}

function onSemanticScale(hue: HuePalette) {
  return {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: `${hue}.800`, dark: `${hue}.300` })
  } as const
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
        $root: color({ light: 'gray.200', dark: 'gray.900' }),
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
    focus: {
      $root: color({
        light: 'pd.system.color.primary.border.strong',
        dark: 'pd.system.color.primary.border.strong'
      }),
      danger: color({
        light: 'pd.system.color.danger.border.strong',
        dark: 'pd.system.color.danger.border.strong'
      }),
      halo: color({
        light: alpha('indigo.600', '20'),
        dark: alpha('indigo.400', '28')
      }),
      'danger-halo': color({
        light: alpha('red.600', '20'),
        dark: alpha('red.400', '28')
      })
    }
  },
  primary: semanticScale('indigo'),
  'on-primary': onSemanticScale('indigo'),
  secondary: semanticScale('blue', ['700', '800', '900']),
  'on-secondary': onSemanticScale('blue'),
  success: semanticScale('green'),
  'on-success': onSemanticScale('green'),
  danger: semanticScale('red'),
  'on-danger': onSemanticScale('red'),
  warning: semanticScale('orange'),
  'on-warning': onSemanticScale('orange'),
  info: semanticScale('blue'),
  'on-info': onSemanticScale('blue'),
  neutral: semanticScale('coolGray', ['700', '800', '900']),
  'on-neutral': onSemanticScale('coolGray'),
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
