import { ref, refMap } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

const dimRef = (path: GlobalRefPath<'dimension'>) => ref('dimension', path)
const strokeRef = (path: GlobalRefPath<'strokeStyle'>) => ref('strokeStyle', path)
const dimMap = <K extends string>(entries: Record<K, GlobalRefPath<'dimension'>>) =>
  refMap('dimension', entries)

export const systemBorder = {
  border: {
    width: dimMap({
      none: 'global.border.width.00',
      sm: 'global.border.width.01',
      md: 'global.border.width.02',
      lg: 'global.border.width.03'
    })
  },
  focus: {
    width: dimRef('global.border.width.02'),
    style: strokeRef('global.border.style.solid'),
    offset: dimMap({
      default: 'global.border.offset.02',
      flush: 'global.border.offset.00',
      inset: 'global.border.offset.inset-02'
    })
  },
  radius: dimMap({
    none: 'global.radius.00',
    '2xs': 'global.radius.01',
    xs: 'global.radius.02',
    sm: 'global.radius.03',
    md: 'global.radius.04',
    lg: 'global.radius.05',
    xl: 'global.radius.06',
    '2xl': 'global.radius.07',
    full: 'global.radius.full'
  })
} as const
