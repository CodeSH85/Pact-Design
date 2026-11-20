import type { FormatFnArguments } from 'style-dictionary/types'
import { getTokenType } from '../transforms/dtcg.ts'

export interface TokenMetaEntry {
  name: string
  path: string[]
  $type?: string
}

export function formatTokenMeta({ dictionary }: FormatFnArguments): string {
  const entries: TokenMetaEntry[] = dictionary.allTokens.map((token) => {
    const $type = getTokenType(token)
    return $type ? { name: token.name, path: token.path, $type } : { name: token.name, path: token.path }
  })
  return `${JSON.stringify(entries, null, 2)}\n`
}
