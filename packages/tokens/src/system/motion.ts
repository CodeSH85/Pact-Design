import { refMap } from '../factory.ts'
import type { GlobalRefPath } from '../global/index.ts'

export const systemMotion = {
  duration: refMap('duration', {
    instant: 'pd.global.motion.duration.00',
    fast: 'pd.global.motion.duration.01',
    normal: 'pd.global.motion.duration.02',
    slow: 'pd.global.motion.duration.03',
    slower: 'pd.global.motion.duration.04'
  } as const satisfies Record<string, GlobalRefPath<'duration'>>),
  easing: refMap('cubicBezier', {
    $root: 'pd.global.motion.easing.standard',
    enter: 'pd.global.motion.easing.enter',
    exit: 'pd.global.motion.easing.exit',
    linear: 'pd.global.motion.easing.linear'
  } as const satisfies Record<string, GlobalRefPath<'cubicBezier'>>)
} as const
