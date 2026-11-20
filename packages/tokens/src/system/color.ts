import { internal, ref, themed, withUno } from '../dsl/index.ts'
import type { GlobalRefPath } from '../global/index.ts'

type ColorPaletteName = 'indigo' | 'blue' | 'green' | 'red' | 'orange' | 'coolGray'
type SystemColorRef = GlobalRefPath<'color'> | 'system.background.layer-2' | 'system.semantic.primary'

const cRef = (path: SystemColorRef) => ref('color', path)
const tColor = (light: SystemColorRef, dark: SystemColorRef) => themed(cRef(light), cRef(dark))

function semanticRole<R extends string>(
  role: R,
  palette: ColorPaletteName,
  lightStops: readonly ['600' | '700', '700' | '800', '800' | '900'] = ['600', '700', '800']
) {
  const [lBase, lHover, lActive] = lightStops
  return {
    [role]: tColor(`global.${palette}.${lBase}`, `global.${palette}.700`),
    [`${role}-hover`]: tColor(`global.${palette}.${lHover}`, `global.${palette}.600`),
    [`${role}-active`]: tColor(`global.${palette}.${lActive}`, `global.${palette}.800`),
    [`on-${role}`]: tColor('global.white', 'global.white'),
    [`${role}-subtle`]: tColor(`global.${palette}.200`, `global.${palette}.1000`),
    [`on-${role}-subtle`]: tColor(`global.${palette}.800`, `global.${palette}.300`),
    [`${role}-border`]: tColor(`global.${palette}.300`, `global.${palette}.800`)
  } as Record<
    R | `${R}-hover` | `${R}-active` | `on-${R}` | `${R}-subtle` | `on-${R}-subtle` | `${R}-border`,
    ReturnType<typeof tColor>
  >
}

export const systemColor = {
  background: withUno({ slots: ['colors'], keyFrom: 'category' }, {
    base: tColor('global.gray.200', 'global.gray.1200'),
    'layer-1': tColor('global.white', 'global.gray.1100'),
    'layer-1-hover': tColor('global.gray.100', 'global.gray.1000'),
    'layer-1-active': tColor('global.gray.200', 'global.gray.900'),
    'layer-1-selected': tColor('global.gray.200', 'global.gray.900'),
    'layer-1-selected-hover': tColor('global.gray.300', 'global.gray.800'),
    'layer-2': tColor('global.gray.100', 'global.gray.1000'),
    'layer-2-hover': tColor('global.gray.200', 'global.gray.900'),
    'layer-2-active': tColor('global.gray.300', 'global.gray.800'),
    'layer-2-selected': tColor('global.gray.200', 'global.gray.800'),
    'layer-2-selected-hover': tColor('global.gray.300', 'global.gray.800'),
    elevated: tColor('system.background.layer-2', 'system.background.layer-2'),
    backdrop: tColor('global.scrim.01', 'global.scrim.02'),
    hover: tColor('global.gray.100', 'global.gray.1000'),
    active: tColor('global.gray.200', 'global.gray.900'),
    selected: tColor('global.gray.200', 'global.gray.900'),
    'selected-hover': tColor('global.gray.300', 'global.gray.800'),
    disabled: tColor('global.gray.200', 'global.gray.1000')
  }),
  'on-surface': withUno(
    { slots: ['colors'], keyFrom: 'category', prefix: 'on-surface-', defaultAlias: 'strip' },
    {
      default: tColor('global.gray.1100', 'global.gray.200'),
      secondary: tColor('global.gray.900', 'global.gray.300'),
      muted: tColor('global.gray.700', 'global.gray.400'),
      disabled: tColor('global.gray.500', 'global.gray.600')
    }
  ),
  border: withUno({ slots: ['colors'], keyFrom: 'category', prefix: 'border-' }, {
    subtle: tColor('global.gray.200', 'global.gray.900'),
    default: tColor('global.gray.300', 'global.gray.800'),
    strong: tColor('global.gray.500', 'global.gray.400'),
    focus: tColor('system.semantic.primary', 'global.indigo.400')
  }),
  semantic: withUno({ slots: ['colors'], keyFrom: 'category' }, {
    ...semanticRole('primary', 'indigo'),
    ...semanticRole('secondary', 'blue', ['700', '800', '900']),
    ...semanticRole('success', 'green'),
    ...semanticRole('danger', 'red'),
    ...semanticRole('warning', 'orange'),
    ...semanticRole('info', 'blue'),
    ...semanticRole('neutral', 'coolGray', ['700', '800', '900'])
  }),
  util: internal({
    black: tColor('global.black', 'global.black')
  })
} as const
