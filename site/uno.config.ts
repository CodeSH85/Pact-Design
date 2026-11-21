import { defineConfig, presetWind3, transformerDirectives } from 'unocss'
import { pactPreset } from '@pact-design/styles/uno'

export default defineConfig({
  presets: [
    presetWind3(),
    pactPreset()
  ],
  transformers: [
    transformerDirectives()
  ]
})
