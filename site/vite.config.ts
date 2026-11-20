import fs from 'node:fs/promises'
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
import { defineConfig, type Plugin } from 'vite'

const require = createRequire(import.meta.url)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_PACKAGE_DIR = path.join(ROOT, 'packages/tokens')
const TOKENS_DIR = path.join(TOKENS_PACKAGE_DIR, 'build/tokens')
const REACT_PACKAGE_DIR = path.join(ROOT, 'packages/react')

async function listJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) return listJsonFiles(full)
      return e.name.endsWith('.json') ? [full] : []
    })
  )
  return nested.flat().sort()
}

const toRel = (abs: string): string =>
  `tokens/${path.relative(TOKENS_DIR, abs).split(path.sep).join('/')}`

interface MinimalResponse {
  writeHead: (status: number, headers: Record<string, string>) => void
  end: (data?: string) => void
}

function sendJson(res: MinimalResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  })
  res.end(JSON.stringify(body))
}

function tokensApiPlugin(): Plugin {
  return {
    name: 'pact-tokens-api',
    configureServer(server) {
      server.middlewares.use('/api/tokens', async(req, res, next) => {
        try {
          if (req.method === 'GET') {
            const files: Record<string, unknown> = {}
            const errors: Record<string, string> = {}
            for (const abs of await listJsonFiles(TOKENS_DIR)) {
              const raw = await fs.readFile(abs, 'utf-8')
              try {
                files[toRel(abs)] = JSON.parse(raw)
              // eslint-disable-next-line @stylistic/space-before-function-paren
              } catch (err: unknown) {
                errors[toRel(abs)] = err instanceof Error ? err.message : String(err)
              }
            }
            sendJson(res, 200, { files, errors, readOnly: true })
            return
          }

          if (req.method === 'PUT') {
            sendJson(res, 405, {
              error: 'Generated DTCG JSON is read-only. Edit TypeScript token sources in packages/tokens/src/.'
            })
            return
          }

          next()
        // eslint-disable-next-line @stylistic/space-before-function-paren
        } catch (err: unknown) {
          sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) })
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
      'pact-design/css': path.resolve(TOKENS_PACKAGE_DIR, 'build/css/_variables.css'),
      'pact-design/uno': path.resolve(TOKENS_PACKAGE_DIR, 'build/uno/preset.js'),
      'pact-design': TOKENS_PACKAGE_DIR,
      '@pact-design/tokens/css': path.resolve(TOKENS_PACKAGE_DIR, 'build/css/_variables.css'),
      '@pact-design/tokens/uno': path.resolve(TOKENS_PACKAGE_DIR, 'build/uno/preset.js'),
      '@pact-design/tokens': TOKENS_PACKAGE_DIR,
      '@pact-design/react$': path.resolve(REACT_PACKAGE_DIR, 'src/index.ts'),
      '@pact-design/react': path.resolve(REACT_PACKAGE_DIR, 'src'),
      'react': path.dirname(require.resolve('react/package.json')),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      '@mdx-js/react': path.dirname(require.resolve('@mdx-js/react')),
      '@internationalized/date': path.resolve(path.dirname(require.resolve('@internationalized/date')), '..')
    }
  },
  plugins: [
    tokensApiPlugin(),
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
