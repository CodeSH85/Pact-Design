import { cubicBezier, internal, ms, scale } from '../dsl/index.ts'

export const globalMotion = internal({
  duration: scale({ '00': 0, '01': 50, '02': 100, '03': 150, '04': 200 }, ms),
  easing: {
    linear: cubicBezier(0, 0, 1, 1),
    standard: cubicBezier(0.2, 0, 0, 1),
    enter: cubicBezier(0, 0, 0.15, 1),
    exit: cubicBezier(0.3, 0, 1, 1)
  }
})
