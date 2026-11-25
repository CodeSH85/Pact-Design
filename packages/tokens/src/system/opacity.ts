import { ref, refMap, themed } from '../factory.ts'
import type { GlobalOpacityKey, GlobalRefPath } from '../global/index.ts'

type OpacityRef = GlobalRefPath<'number'>

function opacityRef(key: GlobalOpacityKey) {
  return ref('number', `pd.global.opacity.${key}` as OpacityRef)
}

export const systemOpacity = {
  ...refMap('number', {
    disabled: 'pd.global.opacity.48',
    hover: 'pd.global.opacity.08',
    focus: 'pd.global.opacity.12',
    pressed: 'pd.global.opacity.16'
  } as const satisfies Record<string, OpacityRef>),
  halo: themed(opacityRef('20'), opacityRef('28')),
  scrim: themed(opacityRef('48'), opacityRef('64'))
} as const
