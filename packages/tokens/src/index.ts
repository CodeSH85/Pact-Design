import { componentTokens } from './component/index.ts'
import { globalTokens } from './global/index.ts'
import { systemTokens } from './system/index.ts'

/**
 * Canonical design token tree (`pd.<tier>.<domain>.*`).
 * This object is the single source of truth for token namespaces and emitted CSS variable names.
 */
export const tokens = {
  pd: {
    global: globalTokens,
    system: systemTokens,
    component: componentTokens
  }
} as const

export type TokensTree = typeof tokens

export * from './factory.ts'
export { globalTokens } from './global/index.ts'
export { systemTokens } from './system/index.ts'
export { componentTokens } from './component/index.ts'
