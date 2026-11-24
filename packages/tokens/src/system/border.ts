import { ref, refMap } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

const dimRef = (path: GlobalRefPath<'dimension'>) => ref('dimension', path)
const strokeRef = (path: GlobalRefPath<'strokeStyle'>) => ref('strokeStyle', path)
const dimMap = <K extends string>(entries: Record<K, GlobalRefPath<'dimension'>>) =>
  refMap('dimension', entries)

export const systemBorder = {
  width: dimMap({
    none: 'pd.global.border.width.00',
    sm: 'pd.global.border.width.01',
    md: 'pd.global.border.width.02',
    lg: 'pd.global.border.width.03'
  }),
  focus: {
    width: dimRef('pd.global.border.width.02'),
    style: strokeRef('pd.global.border.style.solid'),
    offset: dimMap({
      $root: 'pd.global.border.offset.02',
      flush: 'pd.global.border.offset.00',
      inset: 'pd.global.border.offset.inset-02'
    })
  }
} as const
