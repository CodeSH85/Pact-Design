import { globalColor } from '@pact-design/tokens/src/global/color.ts'
import { kebab } from '@pact-design/tokens/utils/helper.js'

export type RolePaletteId =
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'mint'
  | 'green'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'purple'
  | 'coolGray'

export type SurfacePresetId =
  | 'gray'
  | 'coolGray'
  | 'warmGray'
  | 'blue'
  | 'indigo'
  | 'sage'
  | 'purple'
  | 'rose'

export interface SiteThemeSelection {
  primary: RolePaletteId
  secondary: RolePaletteId
  surface: SurfacePresetId
}

export const DEFAULT_SITE_THEME: SiteThemeSelection = {
  primary: 'indigo',
  secondary: 'blue',
  surface: 'gray'
}

export interface RolePresetOption {
  id: RolePaletteId
  label: string
  cssSlug: string
  swatchColor: string
}

export interface SurfacePresetOption {
  id: SurfacePresetId
  label: string
  swatchColor: string
  /** Resolved CSS value per surface stop (`0`, `100`..`1200`). */
  stops: Record<SurfaceStopKey, string>
}

const ROLE_STOP_KEYS = [
  '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'
] as const

const SURFACE_STOP_KEYS = [
  '0', '100', '200', '300', '400', '500', '600',
  '700', '800', '900', '1000', '1100', '1200'
] as const

type SurfaceStopKey = (typeof SURFACE_STOP_KEYS)[number]

/** Exact lightness ramp matching `globalColor.gray` so tinted surfaces preserve contrast. */
const SURFACE_LIGHTNESS: Record<Exclude<SurfaceStopKey, '0'>, number> = {
  100: 0.968,
  200: 0.93,
  300: 0.87,
  400: 0.79,
  500: 0.698,
  600: 0.55,
  700: 0.468,
  800: 0.396,
  900: 0.344,
  1000: 0.288,
  1100: 0.244,
  1200: 0.208
}

const SURFACE_CHROMA: Record<Exclude<SurfaceStopKey, '0'>, number> = {
  100: 0.005,
  200: 0.009,
  300: 0.013,
  400: 0.015,
  500: 0.017,
  600: 0.018,
  700: 0.018,
  800: 0.017,
  900: 0.015,
  1000: 0.013,
  1100: 0.011,
  1200: 0.009
}

function buildGlobalSurfaceStops(
  paletteKey: 'gray' | 'coolGray' | 'warmGray',
  stop0: string
): Record<SurfaceStopKey, string> {
  const slug = kebab(paletteKey)
  const stops = { 0: stop0 } as Record<SurfaceStopKey, string>
  for (const key of SURFACE_STOP_KEYS) {
    if (key === '0') continue
    stops[key] = `var(--pd-global-color-${slug}-${key})`
  }
  return stops
}

function buildTintedSurfaceStops(hue: number): Record<SurfaceStopKey, string> {
  const stops = {
    0: `oklch(0.992 0.003 ${hue})`
  } as Record<SurfaceStopKey, string>

  for (const key of SURFACE_STOP_KEYS) {
    if (key === '0') continue
    stops[key] = `oklch(${SURFACE_LIGHTNESS[key]} ${SURFACE_CHROMA[key]} ${hue})`
  }
  return stops
}

const ROLE_META: ReadonlyArray<{ id: RolePaletteId, label: string }> = [
  { id: 'indigo', label: 'Indigo' },
  { id: 'blue', label: 'Blue' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'mint', label: 'Mint' },
  { id: 'green', label: 'Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'red', label: 'Red' },
  { id: 'magenta', label: 'Magenta' },
  { id: 'purple', label: 'Purple' },
  { id: 'coolGray', label: 'Slate' }
]

export const ROLE_PRESETS: ReadonlyArray<RolePresetOption> = ROLE_META.map(({ id, label }) => {
  const cssSlug = kebab(id)
  return {
    id,
    label,
    cssSlug,
    swatchColor: `var(--pd-global-color-${cssSlug}-500)`
  }
})

export const SURFACE_PRESETS: ReadonlyArray<SurfacePresetOption> = [
  {
    id: 'gray',
    label: 'Neutral',
    swatchColor: 'var(--pd-global-color-gray-500)',
    stops: buildGlobalSurfaceStops('gray', 'var(--pd-global-color-white)')
  },
  {
    id: 'coolGray',
    label: 'Slate',
    swatchColor: 'oklch(0.62 0.015 242)',
    stops: buildGlobalSurfaceStops('coolGray', 'oklch(0.992 0.002 242)')
  },
  {
    id: 'warmGray',
    label: 'Stone',
    swatchColor: 'oklch(0.62 0.018 104.8)',
    stops: buildGlobalSurfaceStops('warmGray', 'oklch(0.992 0.003 104.8)')
  },
  {
    id: 'blue',
    label: 'Ocean',
    swatchColor: 'oklch(0.58 0.038 250)',
    stops: buildTintedSurfaceStops(250)
  },
  {
    id: 'indigo',
    label: 'Indigo',
    swatchColor: 'oklch(0.58 0.038 275)',
    stops: buildTintedSurfaceStops(275)
  },
  {
    id: 'sage',
    label: 'Sage',
    swatchColor: 'oklch(0.58 0.034 155)',
    stops: buildTintedSurfaceStops(155)
  },
  {
    id: 'purple',
    label: 'Amethyst',
    swatchColor: 'oklch(0.58 0.036 295)',
    stops: buildTintedSurfaceStops(295)
  },
  {
    id: 'rose',
    label: 'Rose',
    swatchColor: 'oklch(0.58 0.034 15)',
    stops: buildTintedSurfaceStops(15)
  }
]

export const EXPOSED_THEME_VARS: ReadonlyArray<{
  cssVar: string
  label: string
}> = [
  { cssVar: '--pd-system-color-primary', label: 'primary' },
  { cssVar: '--pd-system-color-secondary', label: 'secondary' },
  { cssVar: '--pd-system-color-surface-base', label: 'surface.base' },
  { cssVar: '--pd-system-color-surface-layer-1', label: 'surface.layer-1' },
  { cssVar: '--pd-system-color-surface-layer-2', label: 'surface.layer-2' }
]

const STYLE_ELEMENT_ID = 'pact-site-theme'

export function isDefaultSiteTheme(theme: SiteThemeSelection): boolean {
  return (
    theme.primary === DEFAULT_SITE_THEME.primary &&
    theme.secondary === DEFAULT_SITE_THEME.secondary &&
    theme.surface === DEFAULT_SITE_THEME.surface
  )
}

function buildRoleAliasLines(role: 'primary' | 'secondary', paletteId: RolePaletteId): string[] {
  const slug = kebab(paletteId)
  return ROLE_STOP_KEYS.map(
    (stop) => `  --pd-system-color-palette-${role}-${stop}: var(--pd-global-color-${slug}-${stop});`
  )
}

function buildHaloOklch(paletteId: RolePaletteId, stop: '600' | '400', alpha: number): string {
  const [l, c, h] = globalColor[paletteId][stop].$value.components
  return `oklch(${l} ${c} ${h} / ${alpha})`
}

/**
 * Generates CSS overriding `:root` palette aliases (and Light/Dark focus halos when `primary` changes).
 * Returns an empty string when the selection matches Pact Design's defaults.
 */
export function buildSiteThemeCss(theme: SiteThemeSelection): string {
  if (isDefaultSiteTheme(theme)) return ''

  const rootLines: string[] = []
  const lightLines: string[] = []
  const darkLines: string[] = []

  if (theme.primary !== DEFAULT_SITE_THEME.primary) {
    rootLines.push(...buildRoleAliasLines('primary', theme.primary))
    lightLines.push(
      `  --pd-system-color-border-focus-halo: ${buildHaloOklch(theme.primary, '600', 0.2)};`
    )
    darkLines.push(
      `  --pd-system-color-border-focus-halo: ${buildHaloOklch(theme.primary, '400', 0.28)};`
    )
  }

  if (theme.secondary !== DEFAULT_SITE_THEME.secondary) {
    rootLines.push(...buildRoleAliasLines('secondary', theme.secondary))
  }

  if (theme.surface !== DEFAULT_SITE_THEME.surface) {
    const preset = SURFACE_PRESETS.find((p) => p.id === theme.surface)
    if (preset) {
      for (const stop of SURFACE_STOP_KEYS) {
        rootLines.push(`  --pd-system-color-palette-surface-${stop}: ${preset.stops[stop]};`)
      }
    }
  }

  const blocks: string[] = []
  if (rootLines.length > 0 || lightLines.length > 0) {
    blocks.push(`:root, [data-theme="light"] {\n${[...rootLines, ...lightLines].join('\n')}\n}`)
  }
  if (darkLines.length > 0) {
    blocks.push(`[data-theme="dark"] {\n${darkLines.join('\n')}\n}`)
    const indented = darkLines.map((line) => `  ${line}`).join('\n')
    blocks.push(`@media (prefers-color-scheme: dark) {\n  [data-theme="system"] {\n${indented}\n  }\n}`)
  }

  return blocks.join('\n\n')
}

export function applySiteTheme(theme: SiteThemeSelection): void {
  if (typeof document === 'undefined') return
  const css = buildSiteThemeCss(theme)
  const existing = document.getElementById(STYLE_ELEMENT_ID)

  if (!css) {
    existing?.remove()
    return
  }

  const styleEl = existing ?? document.createElement('style')
  styleEl.id = STYLE_ELEMENT_ID
  styleEl.textContent = css
  if (!existing) {
    document.head.appendChild(styleEl)
  }
}
