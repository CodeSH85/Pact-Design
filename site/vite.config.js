import { Buffer } from 'node:buffer'
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
import { defineConfig } from 'vite'
import { stringifyTokens } from '../packages/tokens/utils/token.js'

const require = createRequire(import.meta.url)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_PACKAGE_DIR = path.join(ROOT, 'packages/tokens')
const TOKENS_DIR = path.join(TOKENS_PACKAGE_DIR, 'tokens')

const isInside = (parent, child) => {
  const rel = path.relative(parent, child)
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel)
}

async function listJsonFiles(dir) {
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

const toRel = (abs) => path.relative(TOKENS_PACKAGE_DIR, abs).split(path.sep).join('/')

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf-8')
}

function tokensApiPlugin() {
  return {
    name: 'pact-tokens-api',
    configureServer(server) {
      server.middlewares.use('/api/tokens', async(req, res, next) => {
        try {
          if (req.method === 'GET') {
            const files = {}
            const errors = {}
            for (const abs of await listJsonFiles(TOKENS_DIR)) {
              const raw = await fs.readFile(abs, 'utf-8')
              try {
                files[toRel(abs)] = JSON.parse(raw)
              // eslint-disable-next-line @stylistic/space-before-function-paren
              } catch (err) {
                errors[toRel(abs)] = err.message
              }
            }
            return sendJson(res, 200, { files, errors })
          }

          if (req.method === 'PUT') {
            const { files } = JSON.parse(await readBody(req))
            const written = []
            for (const [rel, json] of Object.entries(files ?? {})) {
              const abs = path.resolve(TOKENS_PACKAGE_DIR, rel)
              if (!isInside(TOKENS_DIR, abs) || !abs.endsWith('.json')) {
                return sendJson(res, 400, { error: `Refusing to write outside tokens/: ${rel}` })
              }
              const original = await fs.readFile(abs, 'utf-8').catch(() => '')
              const eol = original.includes('\r\n') ? '\r\n' : '\n'
              const trailing = original === '' || /\r?\n$/.test(original) ? eol : ''
              const content = stringifyTokens(json).replace(/\n/g, eol) + trailing
              await fs.writeFile(abs, content, 'utf-8')
              written.push(rel)
            }
            return sendJson(res, 200, { written })
          }

          next()
        // eslint-disable-next-line @stylistic/space-before-function-paren
        } catch (err) {
          sendJson(res, 500, { error: err.message })
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
      '@pact-design/tokens': TOKENS_PACKAGE_DIR,
      'react': path.dirname(require.resolve('react/package.json')),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      '@mdx-js/react': path.dirname(require.resolve('@mdx-js/react'))
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
