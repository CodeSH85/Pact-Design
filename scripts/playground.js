/* global process, Buffer, URL, console */
/**
 * Local dev server for the token playground.
 *
 *   GET  /api/tokens   -> { files: { "tokens/color/global.json": {...}, ... } }
 *   PUT  /api/tokens   <- { files: { "tokens/...json": {...} } }  writes changes back to disk
 *   GET  /*            -> static files from ./playground
 *
 * Usage: pnpm playground   (PORT env var overrides the default 5174)
 */
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stringifyTokens } from '../utils/token.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TOKENS_DIR = path.join(ROOT, 'tokens')
const STATIC_DIR = path.join(ROOT, 'playground')
const UTILS_DIR = path.join(ROOT, 'utils')
const PORT = Number(process.env.PORT) || 5174

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
}

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

const toRel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/')

function send(res, status, body, type = MIME['.json']) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf-8')
}

async function getTokens(res) {
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
  send(res, 200, { files, errors })
}

async function putTokens(req, res) {
  const { files } = JSON.parse(await readBody(req))
  const written = []
  for (const [rel, json] of Object.entries(files ?? {})) {
    const abs = path.resolve(ROOT, rel)
    if (!isInside(TOKENS_DIR, abs) || !abs.endsWith('.json')) {
      return send(res, 400, { error: `Refusing to write outside tokens/: ${rel}` })
    }
    // Preserve the original file's line endings and trailing newline
    const original = await fs.readFile(abs, 'utf-8').catch(() => '')
    const eol = original.includes('\r\n') ? '\r\n' : '\n'
    const trailing = original === '' || /\r?\n$/.test(original) ? eol : ''
    const content = stringifyTokens(json).replace(/\n/g, eol) + trailing
    await fs.writeFile(abs, content, 'utf-8')
    written.push(rel)
  }
  send(res, 200, { written })
}

async function serveStatic(urlPath, res) {
  const rel = decodeURIComponent(urlPath === '/' ? '/index.html' : urlPath)
  const isUtils = rel.startsWith('/utils/')
  const baseDir = isUtils ? UTILS_DIR : STATIC_DIR
  const subPath = isUtils ? rel.slice('/utils'.length) : rel
  const abs = path.resolve(baseDir, `.${subPath}`)
  if (!isInside(baseDir, abs)) return send(res, 403, 'Forbidden', 'text/plain')
  try {
    const data = await fs.readFile(abs)
    send(res, 200, data, MIME[path.extname(abs)] ?? 'application/octet-stream')
  } catch {
    send(res, 404, 'Not found', 'text/plain')
  }
}

const server = http.createServer(async(req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  try {
    if (pathname === '/api/tokens' && req.method === 'GET') return await getTokens(res)
    if (pathname === '/api/tokens' && req.method === 'PUT') return await putTokens(req, res)
    if (req.method === 'GET') return await serveStatic(pathname, res)
    send(res, 405, { error: 'Method not allowed' })
  // eslint-disable-next-line @stylistic/space-before-function-paren
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err.message })
  }
})

server.listen(PORT, () => {
  console.log(`\n  PactUI Token Playground → http://localhost:${PORT}\n`)
})
