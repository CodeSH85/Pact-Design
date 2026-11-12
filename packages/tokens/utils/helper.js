export function isFalsy(param) {
  return param === undefined || param === null
}

export const clamp01 = (n) => Math.min(1, Math.max(0, n))

export const round = (n, d = 4) => Math.round((n + Number.EPSILON) * 10 ** d) / 10 ** d

export const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

export const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )

export const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)))

export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
