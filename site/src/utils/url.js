/**
 * Prefix an internal route with Astro's configured BASE_URL so links work
 * seamlessly in both local dev (`/`) and GitHub Pages (`/Pact-UI/`).
 * @param {string} path
 * @returns {string}
 */
export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${base}${clean}` || '/'
}
