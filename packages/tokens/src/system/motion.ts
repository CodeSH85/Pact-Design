import { refMap, withUno } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

export const systemMotion = {
  motion: {
    duration: withUno(
      { slots: ['duration'], keyFrom: 'category-sub' },
      refMap('duration', {
        instant: 'global.duration.00',
        fast: 'global.duration.01',
        normal: 'global.duration.02',
        slow: 'global.duration.03',
        slower: 'global.duration.04'
      } as const satisfies Record<string, GlobalRefPath<'duration'>>)
    ),
    easing: withUno(
      { slots: ['easing'], keyFrom: 'category-sub' },
      refMap('cubicBezier', {
        default: 'global.easing.standard',
        enter: 'global.easing.enter',
        exit: 'global.easing.exit',
        linear: 'global.easing.linear'
      } as const satisfies Record<string, GlobalRefPath<'cubicBezier'>>)
    )
  }
} as const
