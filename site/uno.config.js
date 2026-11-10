import { presetMini, defineConfig, transformerDirectives } from 'unocss'
import { pactPreset } from 'pact-design/uno'

export default defineConfig({
  presets: [
    presetMini(),
    pactPreset()
  ],
  transformers: [
    transformerDirectives()
  ]
})
