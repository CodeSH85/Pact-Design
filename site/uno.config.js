import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { presetWind3, defineConfig, transformerDirectives } from 'unocss'
import { pactPreset } from 'pact-design/uno'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  content: {
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
