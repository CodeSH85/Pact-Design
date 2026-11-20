import type { TokenGroup } from './dsl/index.ts'
import { globalFiles } from './global/index.ts'
import { systemFiles } from './system/index.ts'
import { componentFiles } from './component/index.ts'

export const tokenModules: Record<string, TokenGroup> = {
  ...globalFiles,
  ...systemFiles,
  ...componentFiles
}

export * from './dsl/index.ts'
export { globalFiles, globalTokens } from './global/index.ts'
export { systemFiles, systemTokens } from './system/index.ts'
export { componentFiles } from './component/index.ts'
