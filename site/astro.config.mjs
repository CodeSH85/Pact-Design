import process from 'node:process'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://codesh85.github.io',
  base: process.env.ASTRO_BASE || '/'
})
