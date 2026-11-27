export interface TokenMetaEntry {
  name: string
  path: string[]
  $type?: string
}

export type UnoSlot =
  | 'colors'
  | 'spacing'
  | 'width'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'borderRadius'
  | 'borderWidth'
  | 'lineWidth'
  | 'ringWidth'
  | 'boxShadow'
  | 'zIndex'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'
  | 'duration'
  | 'easing'
  | 'opacity'

export interface UnoRule {
  slots: UnoSlot[]
  keyFrom?: 'tier' | 'category' | 'category-sub' | 'sub-kebab' | 'self'
  prefix?: string
  stripSegment?: string | string[]
  defaultAlias?: 'strip' | 'DEFAULT'
  defaultFor?: string
  extraKeys?: string[]
  typographyTuple?: boolean
}

export type UnoRuleConfig = UnoRule | UnoRule[]
export type UnoRuleResolution = false | UnoRuleConfig | undefined

const GLOBAL_OMITTED_CATEGORIES = new Set([
  'border',
  'radius',
  'elevation',
  'motion',
  'opacity',
  'size',
  'spacing'
])

const GLOBAL_FONT_RULES: Record<string, UnoRuleConfig | false> = {
  family: false,
  size: { slots: ['fontSize'], keyFrom: 'category-sub', prefix: 'size-' },
  weight: { slots: ['fontWeight'], keyFrom: 'category-sub' },
  'line-height': { slots: ['lineHeight'], keyFrom: 'category-sub' },
  'letter-spacing': { slots: ['letterSpacing'], keyFrom: 'category-sub' }
}

const SYSTEM_COLOR_RULES: Record<string, UnoRuleConfig | false> = {
  palette: false,
  surface: { slots: ['colors'], keyFrom: 'category-sub' },
  shadow: false,
  util: false
}

const SYSTEM_SUB_RULES: Record<string, UnoRuleConfig | false> = {
  'border.width': {
    slots: ['borderWidth', 'lineWidth', 'ringWidth'],
    keyFrom: 'category-sub',
    defaultFor: 'sm'
  },
  'border.focus': false,
  'size.control': {
    slots: ['spacing', 'height', 'minHeight', 'width'],
    keyFrom: 'category-sub',
    prefix: 'control-'
  },
  'size.icon': {
    slots: ['spacing', 'width', 'height'],
    keyFrom: 'category-sub',
    prefix: 'icon-'
  },
  'elevation.focus': { slots: ['boxShadow'], keyFrom: 'category' },
  'elevation.z': { slots: ['zIndex'], keyFrom: 'category-sub' },
  'motion.duration': { slots: ['duration'], keyFrom: 'category-sub' },
  'font.family': { slots: ['fontFamily'], keyFrom: 'category-sub' },
  'font.weight': { slots: ['fontWeight'], keyFrom: 'category-sub' }
}

const SYSTEM_RULES: Record<string, UnoRuleConfig | false> = {
  radius: { slots: ['borderRadius'], keyFrom: 'category' },
  spacing: { slots: ['spacing'], keyFrom: 'category' },
  size: [
    { slots: ['width', 'height'], keyFrom: 'category' },
    { slots: ['width', 'height'], keyFrom: 'category', prefix: 'size-' }
  ],
  elevation: { slots: ['boxShadow'], keyFrom: 'category', prefix: 'elevation-' },
  font: { slots: ['fontSize'], keyFrom: 'category', typographyTuple: true },
  opacity: { slots: ['opacity'], keyFrom: 'category' }
}

const COMPONENT_COLOR_RULE: UnoRuleConfig = {
  slots: ['colors'],
  keyFrom: 'tier'
}

const COMPONENT_SHADOW_RULE: UnoRuleConfig = [
  { slots: ['boxShadow'], keyFrom: 'tier', stripSegment: 'shadow' },
  { slots: ['boxShadow'], keyFrom: 'tier', prefix: 'elevation-' }
]

const COMPONENT_ZINDEX_RULE: UnoRuleConfig = {
  slots: ['zIndex'],
  keyFrom: 'tier',
  stripSegment: 'z-index'
}

const COMPONENT_SPACING_RULE: UnoRuleConfig = {
  slots: ['spacing'],
  keyFrom: 'tier'
}

const COMPONENT_SIZE_RULE: UnoRuleConfig = [
  { slots: ['width', 'height'], keyFrom: 'tier', stripSegment: ['size', 'icon-size'] },
  { slots: ['spacing'], keyFrom: 'tier' }
]

const COMPONENT_DIMENSION_RULES: Record<string, UnoRuleConfig> = {
  height: [
    { slots: ['height'], keyFrom: 'tier', stripSegment: 'height' },
    { slots: ['spacing'], keyFrom: 'tier' }
  ],
  'max-height': { slots: ['maxHeight'], keyFrom: 'tier', stripSegment: 'max-height' },
  'min-height': { slots: ['minHeight'], keyFrom: 'tier', stripSegment: 'min-height' },
  width: [
    { slots: ['width'], keyFrom: 'tier', stripSegment: 'width' },
    { slots: ['spacing'], keyFrom: 'tier' }
  ],
  'min-width': { slots: ['minWidth'], keyFrom: 'tier', stripSegment: 'min-width' },
  'max-width': { slots: ['maxWidth'], keyFrom: 'tier', stripSegment: 'max-width' },
  size: COMPONENT_SIZE_RULE,
  'icon-size': COMPONENT_SIZE_RULE,
  radius: { slots: ['borderRadius'], keyFrom: 'tier', stripSegment: 'radius' },
  padding: COMPONENT_SPACING_RULE,
  'padding-x': COMPONENT_SPACING_RULE,
  'padding-y': COMPONENT_SPACING_RULE,
  'padding-top': COMPONENT_SPACING_RULE,
  'padding-bottom': COMPONENT_SPACING_RULE,
  'margin-y': COMPONENT_SPACING_RULE,
  gap: COMPONENT_SPACING_RULE,
  offset: COMPONENT_SPACING_RULE,
  translate: COMPONENT_SPACING_RULE
}

/**
 * Strips the leading `pd` root namespace from canonical token paths.
 */
export function normalizeTokenPath(path: string[]): string[] {
  return path[0] === 'pd' ? path.slice(1) : path
}

/**
 * Resolves the UnoCSS theme mapping rule(s) for a token metadata entry.
 * - Returns `false` for tokens intentionally omitted from UnoCSS (CSS-only).
 * - Returns `undefined` for unrecognized tokens so the build fails fast.
 */
export function resolveUnoRule(token: TokenMetaEntry): UnoRuleResolution {
  const path = normalizeTokenPath(token.path)
  const [tier, category, sub, ...tail] = path
  const type = token.$type

  if (tier === 'global') {
    if (category === 'font') return GLOBAL_FONT_RULES[sub]
    if (GLOBAL_OMITTED_CATEGORIES.has(category)) return false
    if (category === 'color') {
      return path.length === 3
        ? { slots: ['colors'], keyFrom: 'category' }
        : { slots: ['colors'], keyFrom: 'sub-kebab' }
    }
    return undefined
  }

  if (tier === 'system') {
    if (category === 'color') {
      if (sub in SYSTEM_COLOR_RULES) return SYSTEM_COLOR_RULES[sub]
      if (sub === 'on-surface') {
        return tail.length === 0
          ? { slots: ['colors'], keyFrom: 'category', extraKeys: ['on-surface-default'] }
          : { slots: ['colors'], keyFrom: 'category' }
      }
      if (sub === 'border') {
        return tail.length === 0
          ? { slots: ['colors'], keyFrom: 'category', extraKeys: ['border-default'] }
          : { slots: ['colors'], keyFrom: 'category' }
      }
      return { slots: ['colors'], keyFrom: 'category' }
    }

    if (category === 'motion' && sub === 'easing') {
      return tail.length === 0
        ? { slots: ['easing'], extraKeys: ['default', 'DEFAULT'] }
        : { slots: ['easing'], keyFrom: 'category-sub' }
    }

    const compound = sub ? SYSTEM_SUB_RULES[`${category}.${sub}`] : undefined
    if (compound !== undefined) return compound
    return SYSTEM_RULES[category]
  }

  if (tier === 'component') {
    if (type === 'color') return COMPONENT_COLOR_RULE
    if (type === 'shadow') return COMPONENT_SHADOW_RULE
    if (type === 'number' && path.includes('z-index')) return COMPONENT_ZINDEX_RULE
    if (type === 'dimension') {
      const rest = path.slice(2)
      for (const segment of rest) {
        const matched = COMPONENT_DIMENSION_RULES[segment]
        if (matched) return matched
      }
    }
    return undefined
  }

  return undefined
}
