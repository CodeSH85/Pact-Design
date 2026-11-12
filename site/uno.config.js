import { presetWind3, defineConfig, transformerDirectives } from 'unocss'
import { pactPreset } from 'pact-design/uno'

export default defineConfig({
  presets: [
    presetWind3(),
    pactPreset()
  ],
  transformers: [
    transformerDirectives()
  ]
})
