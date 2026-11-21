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

export interface UnoRule {
  slots: UnoSlot[]
  keyFrom?: 'tier' | 'category' | 'category-sub' | 'scale-kebab' | 'self'
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
  'offset',
  'blur',
  'spread',
  'z-index',
  'duration',
  'easing',
  'size',
  'spacing'
])

const GLOBAL_FONT_RULES: Record<string, UnoRuleConfig> = {
  family: { slots: ['fontFamily'], keyFrom: 'category-sub' },
  size: { slots: ['fontSize'], keyFrom: 'category-sub', prefix: 'size-' },
  weight: { slots: ['fontWeight'], keyFrom: 'category-sub' },
  'line-height': { slots: ['lineHeight'], keyFrom: 'category-sub' },
  'letter-spacing': { slots: ['letterSpacing'], keyFrom: 'category-sub' }
}

const SYSTEM_SUB_RULES: Record<string, UnoRuleConfig> = {
  'border.width': {
    slots: ['borderWidth', 'lineWidth', 'ringWidth'],
    keyFrom: 'category-sub',
    defaultFor: 'sm'
  },
  'control.height': {
    slots: ['spacing', 'height', 'minHeight', 'width'],
    keyFrom: 'category-sub',
    prefix: 'control-'
  },
  'icon.size': {
    slots: ['spacing', 'width', 'height'],
    keyFrom: 'category-sub',
    prefix: 'icon-'
  },
  'motion.duration': { slots: ['duration'], keyFrom: 'category-sub' },
  'motion.easing': { slots: ['easing'], keyFrom: 'category-sub' }
}

const SYSTEM_RULES: Record<string, UnoRuleConfig | false> = {
  background: { slots: ['colors'], keyFrom: 'category' },
  'on-surface': { slots: ['colors'], keyFrom: 'category', prefix: 'on-surface-', defaultAlias: 'strip' },
  border: { slots: ['colors'], keyFrom: 'category', prefix: 'border-' },
  semantic: { slots: ['colors'], keyFrom: 'category' },
  radius: { slots: ['borderRadius'], keyFrom: 'category' },
  spacing: { slots: ['spacing'], keyFrom: 'category' },
  size: [
    { slots: ['width', 'height'], keyFrom: 'category' },
    { slots: ['width', 'height'], keyFrom: 'category', prefix: 'size-' }
  ],
  elevation: { slots: ['boxShadow'], keyFrom: 'category', prefix: 'elevation-' },
  'z-index': { slots: ['zIndex'], keyFrom: 'category' },
  font: { slots: ['fontSize'], keyFrom: 'category', typographyTuple: true },
  focus: false,
  shadow: false,
  util: false
}

const COMPONENT_COLOR_RULE: UnoRuleConfig = {
  slots: ['colors'],
  keyFrom: 'tier',
  stripSegment: 'color',
  defaultAlias: 'strip'
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
 * Resolves the UnoCSS theme mapping rule(s) for a token metadata entry.
 * - Returns `false` for tokens intentionally omitted from UnoCSS (CSS-only).
 * - Returns `undefined` for unrecognized tokens so the build fails fast.
 */
export function resolveUnoRule(token: TokenMetaEntry): UnoRuleResolution {
  const [tier, category, sub] = token.path
  const type = token.$type

  if (tier === 'global') {
    if (category === 'font') return GLOBAL_FONT_RULES[sub]
    if (GLOBAL_OMITTED_CATEGORIES.has(category)) return false
    if (type === 'color') {
      return token.path.length === 2
        ? { slots: ['colors'], keyFrom: 'self' }
        : { slots: ['colors'], keyFrom: 'scale-kebab' }
    }
    return undefined
  }

  if (tier === 'system') {
    const compound = sub ? SYSTEM_SUB_RULES[`${category}.${sub}`] : undefined
    if (compound !== undefined) return compound
    return SYSTEM_RULES[category]
  }

  if (tier === 'component') {
    if (type === 'color') return COMPONENT_COLOR_RULE
    if (type === 'shadow') return COMPONENT_SHADOW_RULE
    if (type === 'number' && token.path.includes('z-index')) return COMPONENT_ZINDEX_RULE
    if (type === 'dimension') {
      const rest = token.path.slice(2)
      for (const segment of rest) {
        const matched = COMPONENT_DIMENSION_RULES[segment]
        if (matched) return matched
      }
    }
    return undefined
  }

  return undefined
}
