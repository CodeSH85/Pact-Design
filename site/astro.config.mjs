import process from 'node:process'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://codesh85.github.io',
  base: process.env.ASTRO_BASE || '/',
  integrations: [
    react(),
    UnoCSS({ injectReset: true })
  ]
})
