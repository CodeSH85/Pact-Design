import { execFile } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import UnoCSS from 'unocss/vite'
import { defineConfig, type Plugin } from 'vite'
import { rehypeShiki } from './plugins/rehype-shiki.ts'

const require = createRequire(import.meta.url)
const execFileAsync = promisify(execFile)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_PACKAGE_DIR = path.join(ROOT, 'packages/tokens')
const STYLES_PACKAGE_DIR = path.join(ROOT, 'packages/styles')
const REACT_PACKAGE_DIR = path.join(ROOT, 'packages/react')

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

/**
 * Watches @pact-design/tokens and @pact-design/styles sources during `vite dev`,
 * rebuilding compiled CSS/preset artifacts and triggering CSS HMR (or a server
 * restart when the UnoCSS theme keys change).
 */
function pactWatchTokensAndStyles(): Plugin {
  const tokensSrcDir = path.join(TOKENS_PACKAGE_DIR, 'src')
  const stylesSrcDir = path.join(STYLES_PACKAGE_DIR, 'src')
  const tokensBuildScript = path.join(TOKENS_PACKAGE_DIR, 'scripts/build.ts')
  const stylesBuildScript = path.join(STYLES_PACKAGE_DIR, 'scripts/build.ts')
  const stylesPresetPath = path.join(STYLES_PACKAGE_DIR, 'build/uno/preset.js')
  const stylesIndexCssPath = path.join(STYLES_PACKAGE_DIR, 'build/css/index.css')
  const siteGlobalCssPath = path.join(ROOT, 'site/src/styles/global.css')

  return {
    name: 'pact-watch-tokens-styles',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add([tokensSrcDir, stylesSrcDir])

      let running = false
      let pendingTokens = false
      let pendingStyles = false
      let timer: ReturnType<typeof setTimeout> | null = null

      async function runRebuild(): Promise<void> {
        if (running) return
        running = true

        while (pendingTokens || pendingStyles) {
          const rebuildTokens = pendingTokens
          pendingTokens = false
          pendingStyles = false

          const prevPreset = readFileSafe(stylesPresetPath)

          try {
            if (rebuildTokens) {
              await execFileAsync(process.execPath, [tokensBuildScript], {
                cwd: TOKENS_PACKAGE_DIR
              })
            }
            await execFileAsync(process.execPath, [stylesBuildScript], {
              cwd: STYLES_PACKAGE_DIR
            })

            const nextPreset = readFileSafe(stylesPresetPath)
            if (prevPreset !== nextPreset) {
              server.config.logger.info(
                '[pact] UnoCSS preset changed — restarting dev server',
                { timestamp: true }
              )
              void server.restart()
              break
            }

            for (const cssPath of [stylesIndexCssPath, siteGlobalCssPath]) {
              const mods = server.moduleGraph.getModulesByFile(cssPath)
              if (mods) {
                for (const mod of mods) {
                  await server.reloadModule(mod)
                }
              }
            }

            server.config.logger.info(
              `[pact] Rebuilt ${rebuildTokens ? 'tokens + styles' : 'styles'}`,
              { timestamp: true }
            )
          } catch(error) {
            const message = error instanceof Error ? error.message : String(error)
            server.config.logger.error(
              `[pact] Token/style rebuild failed:\n${message}`,
              { timestamp: true }
            )
          }
        }

        running = false
      }

      function schedule(filePath: string): void {
        const resolved = path.resolve(filePath)
        const inTokens = resolved.startsWith(`${tokensSrcDir}${path.sep}`)
        const inStyles = resolved.startsWith(`${stylesSrcDir}${path.sep}`)
        if (!inTokens && !inStyles) return

        if (inTokens) pendingTokens = true
        pendingStyles = true

        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          timer = null
          void runRebuild()
        }, 80)
      }

      server.watcher.on('change', schedule)
      server.watcher.on('add', schedule)
      server.watcher.on('unlink', schedule)
      server.httpServer?.once('close', () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      })
    }
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  server: {
    fs: {
      allow: [ROOT]
    }
  },
  resolve: {
    alias: {
      '@pact-design/tokens/css': path.resolve(TOKENS_PACKAGE_DIR, 'build/css/_variables.css'),
      '@pact-design/tokens/meta': path.resolve(TOKENS_PACKAGE_DIR, 'build/meta/tokens.json'),
      '@pact-design/tokens': TOKENS_PACKAGE_DIR,
      '@pact-design/styles/css/layered': path.resolve(STYLES_PACKAGE_DIR, 'build/css/layered.css'),
      '@pact-design/styles/css/tokens': path.resolve(STYLES_PACKAGE_DIR, 'build/css/tokens.css'),
      '@pact-design/styles/css/theme': path.resolve(STYLES_PACKAGE_DIR, 'build/css/theme.css'),
      '@pact-design/styles/css/reset': path.resolve(STYLES_PACKAGE_DIR, 'build/css/reset.css'),
      '@pact-design/styles/css/components/': `${path.resolve(STYLES_PACKAGE_DIR, 'build/css/components')}/`,
      '@pact-design/styles/css/components': path.resolve(STYLES_PACKAGE_DIR, 'build/css/components.css'),
      '@pact-design/styles/css': path.resolve(STYLES_PACKAGE_DIR, 'build/css/index.css'),
      '@pact-design/styles/uno': path.resolve(STYLES_PACKAGE_DIR, 'build/uno/preset.js'),
      '@pact-design/styles': STYLES_PACKAGE_DIR,
      '@pact-design/react/styles.css': path.resolve(REACT_PACKAGE_DIR, 'src/styles.css'),
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
        ],
        rehypePlugins: [rehypeShiki]
      })
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    UnoCSS(),
    pactWatchTokensAndStyles()
  ]
})
