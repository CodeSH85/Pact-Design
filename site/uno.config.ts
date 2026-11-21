import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import { pactPreset } from '@pact-design/styles/uno'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        /packages\/react\/src\/.*\.ts($|\?)/
      ]
    },
    filesystem: [
      path.resolve(__dirname, '../packages/react/src/**/*.{js,jsx,ts,tsx}')
    ]
  },
  presets: [
    presetWind3(),
    pactPreset()
  ],
  transformers: [
    transformerDirectives()
  ]
})
