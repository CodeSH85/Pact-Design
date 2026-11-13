import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clone, same } from 'pact-design/utils/helper.js'
import * as T from 'pact-design/utils/token.js'
import { loadTokenCatalog } from '../../utils/tokens-loader.js'
import { Button } from '@pact-design/react'
import { CATEGORY_ORDER, TokenEditor } from './TokenEditor.jsx'
import { TokenPreview } from './TokenPreview.jsx'

export function TokenPlayground() {
  const [files, setFiles] = useState({})
  const [original, setOriginal] = useState({})
  const [loadErrors, setLoadErrors] = useState({})
  const [canWriteToDisk, setCanWriteToDisk] = useState(false)
  const [revision, setRevision] = useState(0)

  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'light'
    }
    return 'light'
  })
  const [category, setCategory] = useState('color')
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')
  const [selectedShade, setSelectedShade] = useState({})
  const [paletteTools, setPaletteTools] = useState(() => new Set())
  const [swatchContrastMode, setSwatchContrastMode] = useState('lc-white')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [activeModal, setActiveModal] = useState(null) // 'css' | 'issues' | null
  const [flashedId, setFlashedId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError })
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
    }, 2200)
  }, [])

  useEffect(() => {
    document.title = 'Token Playground | Pact Design'
  }, [])

  // Sync with site header theme toggle
  useEffect(() => {
    const onSiteThemeChange = (e) => {
      const nextTheme = e.detail?.theme
      if (nextTheme === 'light' || nextTheme === 'dark') {
        setTheme(nextTheme)
      }
    }
    window.addEventListener('pact:theme-change', onSiteThemeChange)
    return () => window.removeEventListener('pact:theme-change', onSiteThemeChange)
  }, [])

  const handleThemeChange = useCallback((nextTheme) => {
    setTheme(nextTheme)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('pact-theme', nextTheme)
      window.dispatchEvent(new CustomEvent('pact:theme-change', { detail: { theme: nextTheme } }))
    }
  }, [])

  // Load tokens from /api/tokens (Vite dev middleware) or fallback to bundled tokens
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/tokens')
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setFiles(clone(data.files))
        setOriginal(clone(data.files))
        setLoadErrors(data.errors ?? {})
        setCanWriteToDisk(true)
      } catch {
        if (cancelled) return
        const catalog = loadTokenCatalog()
        setFiles(clone(catalog.files))
        setOriginal(clone(catalog.files))
        setLoadErrors({})
        setCanWriteToDisk(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const originalTokensByTheme = useMemo(() => {
    if (!Object.keys(original).length) {
      return { light: new Map(), dark: new Map() }
    }
    return {
      light: T.flatten(original, 'light').tokens,
      dark: T.flatten(original, 'dark').tokens
    }
  }, [original])

  const derived = useMemo(() => {
    // revision triggers recomputation when token nodes are mutated in place
    void revision
    const lightFlat = T.flatten(files, 'light')
    const darkFlat = T.flatten(files, 'dark')
    const activeFlat = theme === 'dark' ? darkFlat : lightFlat

    const parityIssues = []
    for (const t of lightFlat.tokens.values()) {
      if (T.themeOf(t.file) === 'light' && !darkFlat.tokens.has(t.id)) {
        parityIssues.push({
          id: t.id,
          file: t.file,
          message: '在深色主題 (*.dark.json) 中缺少對應的同名 token'
        })
      }
    }
    for (const t of darkFlat.tokens.values()) {
      if (T.themeOf(t.file) === 'dark' && !lightFlat.tokens.has(t.id)) {
        parityIssues.push({
          id: t.id,
          file: t.file,
          message: '在淺色主題 (*.light.json) 中缺少對應的同名 token'
        })
      }
    }

    const tokens = activeFlat.tokens
    const originalTokens = originalTokensByTheme[theme] ?? new Map()
    const issues = [...activeFlat.issues, ...parityIssues]
    const usage = T.buildUsage(tokens)
    const resolved = new Map(
      [...tokens.values()].map((t) => [t.id, T.tryResolve(t, tokens)])
    )
    const { css, errors } = T.buildCss(lightFlat.tokens, darkFlat.tokens)
    const errorsById = new Map(errors.map((e) => [e.id, e.message]))

    const dirtyFilesList = Object.keys(files).filter((f) => !same(files[f], original[f]))
    const allIssues = [
      ...Object.entries(loadErrors).map(([file, message]) => ({
        id: file,
        file,
        message: `JSON 解析失敗：${message}`
      })),
      ...issues,
      ...errors
    ]

    return {
      tokens,
      originalTokens,
      issues,
      usage,
      resolved,
      css,
      errors,
      errorsById,
      dirtyFilesList,
      allIssues
    }
  }, [files, original, loadErrors, theme, revision, originalTokensByTheme])

  const triggerMutate = useCallback(() => {
    setRevision((r) => r + 1)
  }, [])

  const handleSelectCategory = useCallback((cat) => {
    setCategory(cat)
    const editorBody = document.getElementById('playground-editor-body')
    if (editorBody) editorBody.scrollTop = 0
    const previewSec = document.getElementById(`pv-${cat}`)
    if (previewSec) previewSec.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSelectShade = useCallback((parentId, tokenId) => {
    setSelectedShade((prev) => ({ ...prev, [parentId]: tokenId }))
  }, [])

  const handleTogglePaletteTools = useCallback((parentId) => {
    setPaletteTools((prev) => {
      const next = new Set(prev)
      if (next.has(parentId)) next.delete(parentId)
      else next.add(parentId)
      return next
    })
  }, [])

  const handleJump = useCallback((id) => {
    if (!id) return
    const token = derived.tokens.get(id)
    if (!token) return
    setSidebarCollapsed(false)
    setCategory(T.categoryOf(token.file))
    setLevel((prevLevel) => (prevLevel !== 'all' && prevLevel !== T.levelOf(token.file) ? 'all' : prevLevel))
    setQuery((prevQuery) => {
      if (!prevQuery) return ''
      const q = prevQuery.toLowerCase()
      const matches = token.id.toLowerCase().includes(q) || T.cssName(token.path).includes(q)
      return matches ? prevQuery : ''
    })
    const parent = token.path.slice(0, -1).join('.')
    setSelectedShade((prev) => ({ ...prev, [parent]: id }))
    setFlashedId(id)

    setTimeout(() => {
      const target = document.querySelector(`[data-id="${CSS.escape(id)}"]`)
      if (target) {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }, 40)

    setTimeout(() => {
      setFlashedId((cur) => (cur === id ? null : cur))
    }, 1500)
  }, [derived.tokens])

  const handleSave = useCallback(async() => {
    const dirty = derived.dirtyFilesList
    if (!dirty.length) return
    if (derived.errors.length && !window.confirm(`目前有 ${derived.errors.length} 個 token 無法解析，仍要儲存嗎？`)) {
      return
    }
    try {
      const res = await fetch('/api/tokens', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: Object.fromEntries(dirty.map((f) => [f, files[f]]))
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? res.statusText)
      setOriginal(clone(files))
      showToast(`已寫入 ${data.written.length} 個檔案`)
    // eslint-disable-next-line @stylistic/space-before-function-paren
    } catch (err) {
      showToast(`儲存失敗：${err.message}`, true)
    }
  }, [derived.dirtyFilesList, derived.errors.length, files, showToast])

  const handleDownload = useCallback(() => {
    for (const f of derived.dirtyFilesList) {
      const blob = new Blob([T.stringifyTokens(files[f]) + '\n'], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = f.replace(/^tokens\//, '').replaceAll('/', '-')
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }, [derived.dirtyFilesList, files])

  const handleResetAll = useCallback(() => {
    if (!window.confirm('捨棄所有尚未儲存的變更？')) return
    setFiles(clone(original))
    setRevision((r) => r + 1)
    showToast('已重設所有變更')
  }, [original, showToast])

  // Keyboard shortcuts & beforeunload guard
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setSidebarCollapsed((prev) => !prev)
      }
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null)
      }
    }
    const onBeforeUnload = (e) => {
      if (derived.dirtyFilesList.length > 0) {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [handleSave, activeModal, derived.dirtyFilesList.length])

  // Ensure default category is valid once files load
  useEffect(() => {
    const fileKeys = Object.keys(files)
    if (!fileKeys.length) return
    const cats = [...new Set(fileKeys.map(T.categoryOf))].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
    })
    if (cats.length && !cats.includes(category)) {
      setCategory(cats[0])
    }
  }, [files, category])

  const isDirty = derived.dirtyFilesList.length > 0

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-layer-1 rounded-xs border-sm border-border-default">
      {/* Live Runtime CSS Custom Properties Override */}
      <style id="pact-playground-token-css">{derived.css}</style>

      {/* Playground Action Header */}
      <header className="flex flex-wrap items-center justify-between gap-sm px-md py-xs bg-layer-2 border-b border-border-default shrink-0">
        <div className="flex items-center gap-sm">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-xs bg-primary text-on-primary text-label-sm font-bold">
            P
          </span>
          <div className="flex flex-col">
            <strong className="text-label-md text-on-surface">
              Pact Design Token Playground
            </strong>
            <small className="text-caption-sm text-on-surface-muted">
              {derived.tokens.size} tokens · {Object.keys(files).length} 個檔案
            </small>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-xs">
          {derived.allIssues.length > 0 && (
            <Button
              variant="danger"
              size="xs"
              onClick={() => setActiveModal('issues')}
            >
              ⚠ {derived.allIssues.length} 個問題
            </Button>
          )}

          {isDirty && (
            <span
              title={derived.dirtyFilesList.join('\n')}
              className="px-xs py-3xs rounded-2xs bg-warning-subtle text-on-warning-subtle border-sm border-warning-border text-caption-sm font-medium"
            >
              {derived.dirtyFilesList.length} 個檔案未儲存
            </span>
          )}

          <Button
            variant="secondary"
            size="xs"
            onClick={() => setActiveModal('css')}
          >
            檢視 CSS
          </Button>
          <Button
            variant="secondary"
            size="xs"
            disabled={!isDirty}
            onClick={handleDownload}
          >
            下載 JSON
          </Button>
          <Button
            variant="secondary"
            size="xs"
            disabled={!isDirty}
            onClick={handleResetAll}
          >
            全部重設
          </Button>
          <Button
            variant="primary"
            size="xs"
            disabled={!isDirty || !canWriteToDisk}
            title={canWriteToDisk ? '寫入變更至 tokens/ 目錄 (⌘S)' : '靜態預覽模式請使用「下載 JSON」'}
            onClick={handleSave}
          >
            儲存至 tokens/
          </Button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!sidebarCollapsed && (
          <TokenEditor
            files={files}
            tokens={derived.tokens}
            originalTokens={derived.originalTokens}
            resolved={derived.resolved}
            errorsById={derived.errorsById}
            usage={derived.usage}
            theme={theme}
            category={category}
            query={query}
            level={level}
            selectedShade={selectedShade}
            paletteTools={paletteTools}
            dirtyFilesList={derived.dirtyFilesList}
            flashedId={flashedId}
            onSelectCategory={handleSelectCategory}
            onQueryChange={setQuery}
            onLevelChange={setLevel}
            onSelectShade={handleSelectShade}
            onTogglePaletteTools={handleTogglePaletteTools}
            onMutate={triggerMutate}
            onToast={showToast}
          />
        )}

        <TokenPreview
          tokens={derived.tokens}
          resolved={derived.resolved}
          theme={theme}
          sidebarCollapsed={sidebarCollapsed}
          swatchContrastMode={swatchContrastMode}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onThemeChange={handleThemeChange}
          onSwatchContrastChange={setSwatchContrastMode}
          onJump={handleJump}
        />
      </div>

      {/* CSS Custom Properties Modal */}
      {activeModal === 'css' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="產生的 CSS Custom Properties"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-modal bg-backdrop flex items-center justify-center p-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-full max-w-3xl max-h-80vh rounded-md bg-elevated border-sm border-border-default shadow-elevation-xl overflow-hidden"
          >
            <header className="flex items-center justify-between px-md py-sm bg-layer-2 border-b border-border-default">
              <strong className="text-label-md text-on-surface">
                產生的 CSS Custom Properties
              </strong>
              <div className="flex items-center gap-xs">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={async() => {
                    await navigator.clipboard?.writeText(derived.css)
                    showToast('已複製 CSS')
                  }}
                >
                  複製
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setActiveModal(null)}
                >
                  關閉
                </Button>
              </div>
            </header>
            <pre className="flex-1 overflow-auto p-md m-0 bg-layer-1 text-mono-xs text-on-surface">
              {derived.css}
            </pre>
          </div>
        </div>
      )}

      {/* Token Issues Modal */}
      {activeModal === 'issues' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Token 問題"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-modal bg-backdrop flex items-center justify-center p-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-full max-w-2xl max-h-80vh rounded-md bg-elevated border-sm border-border-default shadow-elevation-xl overflow-hidden"
          >
            <header className="flex items-center justify-between px-md py-sm bg-layer-2 border-b border-border-default">
              <strong className="text-label-md text-on-surface">
                Token 問題 ({derived.allIssues.length})
              </strong>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setActiveModal(null)}
              >
                關閉
              </Button>
            </header>
            <ul className="flex-1 overflow-auto p-md m-0 list-none flex flex-col gap-xs bg-layer-1">
              {derived.allIssues.map((issue, idx) => (
                <li
                  key={`${issue.id}-${idx}`}
                  className="flex flex-wrap items-center justify-between gap-xs p-xs rounded-xs bg-layer-2 border-sm border-danger-border"
                >
                  <div className="flex items-center gap-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null)
                        handleJump(issue.id)
                      }}
                      className="text-mono-xs text-primary underline cursor-pointer bg-transparent border-none p-0"
                    >
                      {issue.id}
                    </button>
                    <span className="text-body-xs text-on-surface">{issue.message}</span>
                  </div>
                  {issue.file && (
                    <small className="text-mono-xs text-on-surface-muted">{issue.file}</small>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={[
            'fixed bottom-md right-md z-toast px-md py-xs rounded-sm shadow-elevation-lg border-sm text-label-sm',
            toast.isError
              ? 'bg-danger text-on-danger border-danger-border'
              : 'bg-elevated text-on-surface border-border-strong'
          ].join(' ')}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
