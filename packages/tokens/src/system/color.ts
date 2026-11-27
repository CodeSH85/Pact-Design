import { oklch, ref, themed, type DtcgToken, type OklchColorValue } from '../factory.ts'
import { globalColor } from '../global/color.ts'
import { globalOpacity } from '../global/opacity.ts'
import type { GlobalColorKey, GlobalOpacityKey, GlobalRefPath } from '../global/index.ts'

const ROLE_STOPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'] as const
const SURFACE_STOPS = [
  '100', '200', '300', '400', '500', '600',
  '700', '800', '900', '1000', '1100', '1200'
] as const

type Stop = (typeof ROLE_STOPS)[number]
type SurfaceStop = '0' | (typeof SURFACE_STOPS)[number]
type ThemePaletteRole = 'primary' | 'secondary'
type PaletteRoleRef = `pd.system.color.palette.${ThemePaletteRole}.${Stop}`
type PaletteSurfaceRef = `pd.system.color.palette.surface.${SurfaceStop}`

type SystemSelfColorRef =
  | 'pd.system.color.surface.layer-2.$root'
  | 'pd.system.color.primary.border.strong'
  | 'pd.system.color.danger.border.strong'
  | PaletteRoleRef
  | PaletteSurfaceRef

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
type SemanticSource = HuePalette | `pd.system.color.palette.${ThemePaletteRole}`

function rolePaletteAlias(hue: HuePalette): Record<Stop, DtcgToken<'color', `{${GlobalRefPath<'color'>}}`>> {
  return Object.fromEntries(
    ROLE_STOPS.map((stop) => [stop, ref('color', `pd.global.color.${hue}.${stop}` as GlobalRefPath<'color'>)])
  ) as Record<Stop, DtcgToken<'color', `{${GlobalRefPath<'color'>}}`>>
}

function surfacePaletteAlias(): Record<SurfaceStop, DtcgToken<'color', `{${GlobalRefPath<'color'>}}`>> {
  return Object.fromEntries([
    ['0', ref('color', 'pd.global.color.white' as GlobalRefPath<'color'>)],
    ...SURFACE_STOPS.map((stop) => [stop, ref('color', `pd.global.color.gray.${stop}` as GlobalRefPath<'color'>)])
  ]) as Record<SurfaceStop, DtcgToken<'color', `{${GlobalRefPath<'color'>}}`>>
}

function surfaceStop(stop: SurfaceStop): PaletteSurfaceRef {
  return `pd.system.color.palette.surface.${stop}`
}

function stopRef(source: SemanticSource, stop: Stop): SystemColorRef {
  return `${source}.${stop}` as SystemColorRef
}

function semanticScale(
  source: SemanticSource,
  solidLight: readonly [Stop, Stop, Stop] = ['600', '700', '800']
) {
  const [lRoot, lStrong, lStronger] = solidLight
  return {
    $root: color({ light: stopRef(source, lRoot), dark: stopRef(source, '700') }),
    vivid: color({ light: stopRef(source, '600'), dark: stopRef(source, '600') }),
    strong: color({ light: stopRef(source, lStrong), dark: stopRef(source, '600') }),
    stronger: color({ light: stopRef(source, lStronger), dark: stopRef(source, '800') }),
    subtle: color({ light: stopRef(source, '100'), dark: stopRef(source, '1000') }),
    muted: color({ light: stopRef(source, '200'), dark: stopRef(source, '900') }),
    soft: color({ light: stopRef(source, '300'), dark: stopRef(source, '800') }),
    text: {
      $root: color({ light: stopRef(source, '700'), dark: stopRef(source, '400') }),
      strong: color({ light: stopRef(source, '800'), dark: stopRef(source, '300') }),
      stronger: color({ light: stopRef(source, '900'), dark: stopRef(source, '200') })
    },
    border: {
      $root: color({ light: stopRef(source, '300'), dark: stopRef(source, '800') }),
      strong: color({ light: stopRef(source, '600'), dark: stopRef(source, '400') })
    }
  } as const
}

function onSemanticScale(source: SemanticSource) {
  return {
    $root: color({ light: 'white', dark: 'white' }),
    subtle: color({ light: stopRef(source, '800'), dark: stopRef(source, '300') })
  } as const
}

export const systemColor = {
  palette: {
    primary: rolePaletteAlias('indigo'),
    secondary: rolePaletteAlias('blue'),
    surface: surfacePaletteAlias()
  },
  surface: {
    base: color({ light: surfaceStop('200'), dark: surfaceStop('1200') }),
    'layer-1': {
      $root: color({ light: surfaceStop('0'), dark: surfaceStop('1100') }),
      hover: color({ light: surfaceStop('100'), dark: surfaceStop('1000') }),
      active: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
      selected: {
        $root: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
        hover: color({ light: surfaceStop('300'), dark: surfaceStop('800') })
      }
    },
    'layer-2': {
      $root: color({ light: surfaceStop('100'), dark: surfaceStop('1000') }),
      hover: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
      active: color({ light: surfaceStop('300'), dark: surfaceStop('800') }),
      selected: {
        $root: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
        hover: color({ light: surfaceStop('300'), dark: surfaceStop('800') })
      }
    },
    elevated: color({
      light: 'pd.system.color.surface.layer-2.$root',
      dark: 'pd.system.color.surface.layer-2.$root'
    }),
    backdrop: color({ light: 'scrim.01', dark: 'scrim.02' }),
    hover: color({ light: surfaceStop('100'), dark: surfaceStop('1000') }),
    active: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
    selected: {
      $root: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
      hover: color({ light: surfaceStop('300'), dark: surfaceStop('800') })
    },
    control: {
      $root: color({ light: surfaceStop('300'), dark: surfaceStop('800') }),
      hover: color({ light: surfaceStop('400'), dark: surfaceStop('700') })
    },
    disabled: color({ light: surfaceStop('200'), dark: surfaceStop('1000') })
  },
  'on-surface': {
    $root: color({ light: surfaceStop('1100'), dark: surfaceStop('200') }),
    secondary: color({ light: surfaceStop('900'), dark: surfaceStop('300') }),
    muted: color({ light: surfaceStop('700'), dark: surfaceStop('400') }),
    disabled: color({ light: surfaceStop('500'), dark: surfaceStop('600') })
  },
  border: {
    $root: color({ light: surfaceStop('300'), dark: surfaceStop('800') }),
    subtle: color({ light: surfaceStop('200'), dark: surfaceStop('900') }),
    strong: color({ light: surfaceStop('600'), dark: surfaceStop('400') }),
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
  primary: semanticScale('pd.system.color.palette.primary'),
  'on-primary': onSemanticScale('pd.system.color.palette.primary'),
  secondary: semanticScale('pd.system.color.palette.secondary', ['700', '800', '900']),
  'on-secondary': onSemanticScale('pd.system.color.palette.secondary'),
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
