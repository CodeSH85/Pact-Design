import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_PACKAGE_DIR = path.join(ROOT, 'packages/tokens')
const STYLES_PACKAGE_DIR = path.join(ROOT, 'packages/styles')
const REACT_PACKAGE_DIR = path.join(ROOT, 'packages/react')

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  server: {
    fs: {
      allow: [ROOT]
    }
  },
  resolve: {
    alias: {
      'pact-design': TOKENS_PACKAGE_DIR,
      '@pact-design/tokens/css': path.resolve(TOKENS_PACKAGE_DIR, 'build/css/_variables.css'),
      '@pact-design/tokens/meta': path.resolve(TOKENS_PACKAGE_DIR, 'build/meta/tokens.json'),
      '@pact-design/tokens': TOKENS_PACKAGE_DIR,
      '@pact-design/styles/css/theme': path.resolve(STYLES_PACKAGE_DIR, 'build/css/theme.css'),
      '@pact-design/styles/css': path.resolve(STYLES_PACKAGE_DIR, 'build/css/index.css'),
      '@pact-design/styles/uno': path.resolve(STYLES_PACKAGE_DIR, 'build/uno/preset.js'),
      '@pact-design/styles': STYLES_PACKAGE_DIR,
      '@pact-design/react$': path.resolve(REACT_PACKAGE_DIR, 'src/index.ts'),
      '@pact-design/react': path.resolve(REACT_PACKAGE_DIR, 'src'),
      'react': path.dirname(require.resolve('react/package.json')),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      '@mdx-js/react': path.dirname(require.resolve('@mdx-js/react')),
      '@internationalized/date': path.resolve(path.dirname(require.resolve('@internationalized/date')), '..')
    }
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }]
        ]
      })
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    UnoCSS()
  ]
})
