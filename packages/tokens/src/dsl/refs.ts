import type { DtcgToken, DtcgType } from './types.ts'

export function ref<T extends DtcgType, P extends string = string>(
  type: T,
  path: P
): DtcgToken<T, `{${P}}`> {
  return {
    $value: `{${path}}`,
    $type: type
  }
}

export function refMap<T extends DtcgType, K extends string, P extends string>(
  type: T,
  entries: Record<K, P>
): Record<K, DtcgToken<T, `{${P}}`>> {
  return Object.fromEntries(
    Object.entries(entries).map(([k, p]) => [k, ref(type, p as P)])
  ) as Record<K, DtcgToken<T, `{${P}}`>>
}
