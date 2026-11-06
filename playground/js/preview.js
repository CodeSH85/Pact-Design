/**
 * Live preview renderer.
 * Every visual property references a CSS custom property generated from the tokens,
 * so the browser repaints instantly; this module only re-renders labels/metrics.
 */
import { esc } from '../../utils/helper.js'
import { cssName, formatValue, refOf } from '../../utils/token.js'
import { colorValueToHex } from '../../utils/color.js'
import { apcaContrast, apcaLevel, contrast, readableOn, wcagLevel } from '../../utils/contrast.js'

export function renderPreview(root, ctx) {
  const { tokens, resolved } = ctx
  const all = [...tokens.values()]
  const has = (id) => !!id && tokens.has(id)
  const pick = (...ids) => ids.find(has)
  const val = (id) => resolved.get(id)?.value
  const v = (id, fallback = '') => (has(id) ? `var(${cssName(id)}${fallback ? `, ${fallback}` : ''})` : fallback)
  const byType = (type) => all.filter((t) => t.type === type)
  const inFile = (word) => all.filter((t) => t.file.includes(`/${word}/`))
  const isSystem = (t) => t.path[0] === 'system'
  const jump = (id) => `data-jump="${esc(id)}" title="${esc(id)}"`

  // ---- Typography helpers ----
  const typos = byType('typography')
  const pickTypo = (role, size) =>
    typos.find((t) => t.path.includes(role) && t.path.at(-1) === size)?.id ??
    typos.find((t) => t.path.includes(role))?.id
  const font = (id) => {
    if (!has(id)) return ''
    const n = cssName(id)
    return `font:var(${n});letter-spacing:var(${n}-letter-spacing);`
  }

  // ---- Commonly used system tokens (with graceful fallbacks) ----
  const space = (size) => v(pick(`system.spacing.${size}`), '1rem')
  const radius = (size) => v(pick(`system.radius.${size}`), '8px')
  const stroke = v(pick('system.border.width.sm', 'system.stroke.sm', 'global.border.width.01'), '1px')
  const elev = (size) => v(pick(`system.elevation.${size}`), 'none')

  // Canvas colours: use system.background tokens when present, falling back to neutral palette
  const neutral = ['coolGray', 'gray', 'warmGray'].find((n) => has(`global.${n}.500`))
  const n = (shade, fb) => v(neutral && `global.${neutral}.${shade}`, fb)
  const canvasVars = `
    <style>
      .preview[data-canvas="light"] { --pv-canvas:${v('system.background.base', n('100', '#e6e6e6'))}; --pv-surface:${v('system.background.layer-2', v('global.white', '#fff'))}; --pv-text:${v('system.text.primary', n('1000', '#111'))}; --pv-muted:${v('system.text.muted', n('600', '#666'))}; --pv-border:${v('system.border.default', n('200', '#ddd'))}; --pv-subtle:${v('system.background.layer-1', n('50', '#f3f3f3'))}; }
      .preview[data-canvas="dark"]  { --pv-canvas:${v('system.background.base', n('1000', '#1c1c1c'))}; --pv-surface:${v('system.background.layer-2', n('800', '#373737'))}; --pv-text:${v('system.text.primary', n('50', '#fafafa'))}; --pv-muted:${v('system.text.muted', n('200', '#d4d4d4'))}; --pv-border:${v('system.border.default', n('500', '#808080'))}; --pv-subtle:${v('system.background.layer-1', n('900', '#282828'))}; }
      .preview { font-family:${v('global.font.family.sans', 'system-ui')}; }
    </style>`

  // ---- Semantic colour pairs (x / on-x / hover / active / subtle / on-subtle / border) ----
  const pairs = byType('color')
    .filter((t) => {
      const name = t.path.at(-1)
      return !name.startsWith('on-') &&
        !name.endsWith('-subtle') &&
        !name.endsWith('-hover') &&
        !name.endsWith('-active') &&
        !name.endsWith('-border')
    })
    .map((t) => {
      const prefix = t.path.slice(0, -1)
      const name = t.path.at(-1)
      const sibling = (n) => tokens.get([...prefix, n].join('.'))
      const on = sibling(`on-${name}`)
      if (!on) return null
      return {
        bg: t,
        on,
        hover: sibling(`${name}-hover`),
        active: sibling(`${name}-active`),
        subtle: sibling(`${name}-subtle`),
        onSubtle: sibling(`on-${name}-subtle`),
        border: sibling(`${name}-border`)
      }
    })
    .filter(Boolean)
  const pairFor = (name) => pairs.find((p) => p.bg.path.at(-1) === name)

  const section = (id, title, body, note = '') => `
    <section class="pv-section" id="pv-${id}">
      <header class="pv-section-head"><h2>${title}</h2>${note ? `<p>${note}</p>` : ''}</header>
      ${body}
    </section>`

  /**
   * Renders an APCA-first contrast badge (`txtId` on `bgId`), with WCAG 2.1 in tooltip & sub-label.
   * Note: APCA is polarity-sensitive (`txtId` = foreground/text, `bgId` = background).
   */
  const contrastBadge = (txtId, bgId) => {
    const lc = apcaContrast(val(txtId), val(bgId))
    const apca = apcaLevel(lc)
    const ratio = contrast(val(txtId), val(bgId))
    const wcag = wcagLevel(ratio)
    const sign = lc > 0 ? `+${lc.toFixed(1)}` : lc.toFixed(1)
    return `<span class="pv-badge level-${apca.css}" title="APCA: Lc ${sign} (${apca.usage}) · WCAG 2.1: ${ratio.toFixed(2)}:1 (${wcag})">Lc ${Math.abs(lc).toFixed(1)} · ${apca.tier} <small style="opacity:.75">(${ratio.toFixed(1)}:1)</small></span>`
  }

  // =========================================================
  // 1. Composed UI sample
  // =========================================================
  const heading = pickTypo('heading', 'sm') ?? pickTypo('heading', 'md')
  const subheader = pickTypo('subheader', 'sm') ?? pickTypo('subheader', 'md')
  const bodySm = pickTypo('body', 'sm')
  const label = pickTypo('label', 'sm') ?? pickTypo('label', 'md')
  const labelXs = pickTypo('label', 'xs') ?? pickTypo('label', 'sm')
  const caption = pickTypo('caption', 'md') ?? pickTypo('body', 'xs')
  const monoXs = pickTypo('mono', 'xs') ?? pickTypo('mono', 'sm')
  const monoSm = pickTypo('mono', 'sm')
  const primary = pairFor('primary') ?? pairs[0]

  const button = (p, variant = 'solid') => {
    const name = p.bg.path.at(-1)
    const base = `${font(label)}height:${v('system.control.height.sm', '28px')};padding:0 ${space('sm')};border-radius:${radius('xs')};border-width:${stroke};border-style:solid;cursor:pointer;display:inline-flex;align-items:center;`
    if (variant === 'solid') {
      const bgCss = v(p.bg.id)
      const hoverCss = p.hover ? v(p.hover.id) : bgCss
      const activeCss = p.active ? v(p.active.id) : hoverCss
      const fgCss = v(p.on.id)
      const vars = `--btn-bg:${bgCss};--btn-bg-hover:${hoverCss};--btn-bg-active:${activeCss};--btn-fg:${fgCss};--btn-border:${bgCss};--btn-border-hover:${hoverCss};`
      return `<button class="pv-btn" style="${base}${vars}" ${jump(p.bg.id)}>${esc(name)}</button>`
    }
    const outlineBg = 'transparent'
    const outlineHoverBg = p.subtle ? v(p.subtle.id) : v('system.background.hover', 'transparent')
    const outlineActiveBg = v('system.background.active', outlineHoverBg)
    const outlineFg = p.onSubtle ? v(p.onSubtle.id) : v(p.bg.id)
    const outlineBorder = p.border ? v(p.border.id) : v(p.bg.id)
    const vars = `--btn-bg:${outlineBg};--btn-bg-hover:${outlineHoverBg};--btn-bg-active:${outlineActiveBg};--btn-fg:${outlineFg};--btn-border:${outlineBorder};--btn-border-hover:${outlineBorder};`
    return `<button class="pv-btn" style="${base}${vars}" ${jump(p.subtle?.id ?? p.bg.id)}>${esc(name)}</button>`
  }

  const badge = (p) => {
    const name = p.bg.path.at(-1)
    const bgCss = p.subtle ? v(p.subtle.id) : `color-mix(in oklch, ${v(p.bg.id)} 16%, var(--pv-surface))`
    const fgCss = p.onSubtle ? v(p.onSubtle.id) : v(p.bg.id)
    const borderCss = p.border ? v(p.border.id) : 'transparent'
    const jumpId = p.subtle?.id ?? p.bg.id
    return `<span ${jump(jumpId)} style="${font(labelXs)}padding:${space('3xs')} ${space('2xs')};border-radius:${radius('2xs')};background:${bgCss};color:${fgCss};border:${stroke} solid ${borderCss}">${esc(name)}</span>`
  }

  const alert = (p, title, text) => {
    if (!p) return ''
    const bgCss = p.subtle ? v(p.subtle.id) : `color-mix(in oklch, ${v(p.bg.id)} 12%, var(--pv-surface))`
    const borderCss = p.border ? v(p.border.id) : `color-mix(in oklch, ${v(p.bg.id)} 40%, transparent)`
    const titleCss = p.onSubtle ? v(p.onSubtle.id) : v(p.bg.id)
    const jumpId = p.subtle?.id ?? p.bg.id
    return `
    <div class="pv-alert" style="border-radius:${radius('xs')};padding:${space('xs')} ${space('sm')};gap:${space('xs')};
      background:${bgCss};border:${stroke} solid ${borderCss};" ${jump(jumpId)}>
      <span class="pv-alert-dot" style="background:${v(p.bg.id)};color:${v(p.on.id)};border-radius:${radius('2xs')}">!</span>
      <div><strong style="${font(label)}color:${titleCss}">${title}</strong>
      <div style="${font(bodySm)}color:var(--pv-text)">${text}</div></div>
    </div>`
  }

  const uiSample = `
    <div class="pv-ui" style="gap:${space('sm')}">
      <div class="pv-card" style="padding:${space('md')};border-radius:${radius('sm')};border:${stroke} solid var(--pv-border);box-shadow:${elev('xs')};gap:${space('sm')}">
        <div>
          <div style="${font(labelXs)}color:var(--pv-muted);text-transform:uppercase" ${jump(labelXs)}>Workspace · Compact UI</div>
          <h3 style="margin:${space('3xs')} 0 0;${font(heading)}color:var(--pv-text)" ${jump(heading)}>專案設定 Project Settings</h3>
          ${subheader ? `<div style="margin:${space('3xs')} 0 0;${font(subheader)}color:var(--pv-text)" ${jump(subheader)}>高密度、緊湊且直截了當的介面配置</div>` : ''}
          <p style="margin:${space('2xs')} 0 0;${font(bodySm)}color:var(--pv-muted)" ${jump(bodySm)}>減少非必要的留白與視覺裝飾，專注於清晰的資訊階層與快速操作。</p>
        </div>
        <div class="pv-field" style="gap:${space('3xs')}">
          <label style="${font(label)}color:var(--pv-text)" ${jump(label)}>電子郵件 Email</label>
          <input class="pv-input" value="hello@pactdesign.dev" style="${font(bodySm)}height:${v('system.control.height.md', '32px')};padding:0 ${space('xs')};border-radius:${radius('xs')};border:${stroke} solid var(--pv-border);color:var(--pv-text);background:var(--pv-surface)">
          <small style="${font(caption)}color:var(--pv-muted)" ${jump(caption)}>圖說與輔助標註 (Caption)：變更將即時套用至所有連線工作階段。</small>
        </div>
        <div class="pv-row" style="gap:${space('2xs')}">
          ${primary ? button(primary) : ''}
          ${primary ? button(primary, 'outline') : ''}
          ${pairFor('danger') ? button(pairFor('danger'), 'outline') : ''}
        </div>
      </div>

      <div class="pv-stack" style="gap:${space('xs')}">
        <div class="pv-card" style="padding:${space('md')};border-radius:${radius('sm')};border:${stroke} solid var(--pv-border);box-shadow:${elev('xs')};gap:${space('xs')}">
          <h4 style="margin:0;${font(label)}color:var(--pv-text)" ${jump(label)}>狀態提示 Alerts</h4>
          ${alert(pairFor('success'), '儲存成功', '設定變更已即時同步。')}
          ${alert(pairFor('warning'), '額度提醒', '儲存空間使用率已達 85%。')}
          ${alert(pairFor('danger'), '連線異常', '無法連線至遠端節點，請檢查網路狀態。')}
          ${alert(pairFor('info'), '快捷鍵', '按下 ⌘K 可開啟快速指令列。')}
        </div>
        <div class="pv-card" style="padding:${space('md')};border-radius:${radius('sm')};border:${stroke} solid var(--pv-border);box-shadow:${elev('xs')};gap:${space('xs')}">
          <h4 style="margin:0;${font(label)}color:var(--pv-text)" ${jump(label)}>按鈕與標籤 Buttons & Badges</h4>
          <div class="pv-row" style="gap:${space('2xs')}">${pairs.map((p) => button(p)).join('')}</div>
          <div class="pv-row" style="gap:${space('2xs')}">
            ${pairs.map((p) => badge(p)).join('')}
          </div>
        </div>
      </div>
    </div>`

  // =========================================================
  // 2. Colours
  // =========================================================
  const bgBaseId = pick('system.background.base')
  const bgL1Id = pick('system.background.layer-1')
  const bgL1SelectedId = pick('system.background.layer-1-selected', 'system.background.layer-2')
  const bgL2Id = pick('system.background.layer-2')
  const bgElevId = pick('system.background.elevated', 'system.background.layer-2-elevated')
  const bgHoverId = pick('system.background.layer-2-hover', 'system.background.hover')
  const bgActiveId = pick('system.background.layer-2-active', 'system.background.active')
  const bgSelectedId = pick('system.background.layer-2-selected', 'system.background.selected')
  const bgSelectedHoverId = pick('system.background.layer-2-selected-hover', 'system.background.selected-hover')
  const txtPrimaryId = pick('system.text.primary')
  const bgTokens = byType('color').filter((t) => t.path[0] === 'system' && t.path[1] === 'background')
  const isInteractiveBg = (key) => /^(?:layer-[12]-)?(?:hover|active|selected|selected-hover)$/.test(key)
  const bgLayerTokens = bgTokens.filter((t) => !isInteractiveBg(t.path.at(-1)))
  const bgInteractiveTokens = bgTokens.filter((t) => isInteractiveBg(t.path.at(-1)))

  const bgLayersHtml = bgTokens.length ? `
    <h3 class="pv-sub">System · 背景與容器階層（Compact Multi-Pane Workspace 多欄高密度工作區）</h3>
    <div class="pv-spectrum-app" style="border-radius:${radius('sm')};border:${stroke} solid var(--pv-border);box-shadow:${elev('xs')}">
      <!-- TopNav: background-layer-1 -->
      <header class="pv-spectrum-topnav" ${jump(bgL1Id)} style="background:${v(bgL1Id, 'var(--pv-subtle)')};padding:${space('xs')} ${space('sm')};border-bottom:${stroke} solid var(--pv-border);gap:${space('sm')}">
        <div class="pv-row" style="gap:${space('xs')}">
          <span class="pv-spectrum-logo" style="background:${primary ? v(primary.bg.id) : '#3b63fb'};color:${primary ? v(primary.on.id) : '#fff'};border-radius:${radius('2xs')};${font(labelXs)}">P</span>
          <strong style="${font(label)}color:var(--pv-text)">TopNav</strong>
          <nav class="pv-row" style="gap:${space('sm')};${font(bodySm)}color:var(--pv-muted)">
            <span>檔案 File</span><span>編輯 Edit</span><span>檢視 View</span><span>視窗 Window</span>
          </nav>
        </div>
        <div class="pv-row" style="gap:${space('xs')};margin-left:auto">
          <code class="pv-spectrum-tag">background.layer-1 (${esc(formatValue('color', val(bgL1Id)))})</code>
        </div>
      </header>

      <div class="pv-spectrum-body">
        <!-- Left Side-Nav: background-layer-1 -->
        <aside class="pv-spectrum-sidenav" ${jump(bgL1Id)} style="background:${v(bgL1Id, 'var(--pv-subtle)')};padding:${space('xs')};border-right:${stroke} solid var(--pv-border);gap:${space('2xs')}">
          <div style="${font(labelXs)}color:var(--pv-muted)">Side-Nav</div>
          <code class="pv-spectrum-tag">layer-1</code>
          <div class="pv-spectrum-tools" style="gap:${space('3xs')};margin-top:${space('3xs')}">
            ${['▤ 總覽 Overview', '☰ 資料表 Records', '⛁ 儲存體 Storage', '⚙ 系統設定 Settings'].map((tool, i) => `
              <div class="pv-spectrum-tool ${i === 0 ? 'is-active' : ''}" style="padding:${space('3xs')} ${space('xs')};border-radius:${radius('2xs')};${font(bodySm)};${i === 0 ? `background:${v(bgL1SelectedId)};color:var(--pv-text);` : 'color:var(--pv-muted);'}">${tool}</div>
            `).join('')}
          </div>
        </aside>

        <!-- Base Canvas: background-base (no direct UI elements, darkest layer) -->
        <main class="pv-spectrum-canvas" ${jump(bgBaseId)} style="background:${v(bgBaseId, 'var(--pv-canvas)')};padding:${space('md')}">
          <div class="pv-spectrum-canvas-meta">
            <strong style="${font(labelXs)}color:var(--pv-muted)">底層畫布 Workspace Base（結構分隔底層，不直接放置操作元素）</strong>
            <code class="pv-spectrum-tag">background.base (${esc(formatValue('color', val(bgBaseId)))})</code>
          </div>

          <!-- Main Content Block: background-layer-1 -->
          <div class="pv-spectrum-artboard" ${jump(bgL2Id)} style="background:${v(bgL2Id, 'var(--pv-surface)')};border-radius:${radius('xs')};border:${stroke} solid var(--pv-border);padding:${space('md')};gap:${space('sm')}">
            <div class="pv-row" style="justify-content:space-between;border-bottom:${stroke} solid var(--pv-border);padding-bottom:${space('2xs')}">
              <div>
                <strong style="${font(label)}color:var(--pv-text)">主要內容面板 Primary Content Panel</strong>
                <div style="${font(caption)}color:var(--pv-muted)">放置於 background.base 之上，採用最清晰的 background.layer-2 承載密集資訊。</div>
              </div>
              <code class="pv-spectrum-tag">background.layer-2 (${esc(formatValue('color', val(bgL2Id)))})</code>
            </div>

            <div class="pv-spectrum-stage" style="padding:${space('xs')} 0;gap:${space('xs')}">
              <!-- Floating HUD / Popover over Main Block: background-elevated + shadow -->
              <div class="pv-spectrum-floating" ${jump(bgElevId)} style="background:${v(bgElevId, v(bgL2Id))};box-shadow:${elev('md')};border:${stroke} solid var(--pv-border);border-radius:${radius('xs')};padding:${space('sm')};gap:${space('2xs')}">
                <div class="pv-row" style="justify-content:space-between;gap:${space('xs')}">
                  <strong style="${font(label)}color:var(--pv-text)">浮動操作面板 Contextual Popover</strong>
                  <code class="pv-spectrum-tag">background.elevated + elevation.md</code>
                </div>
                <div style="${font(caption)}color:var(--pv-muted)">與 <code>layer-2</code> 亮度相同（${esc(formatValue('color', val(bgElevId)))}），透過陰影與邊框拉開層次。</div>
                <div class="pv-row" style="gap:${space('2xs')};margin-top:${space('3xs')}">
                  ${primary ? button(primary) : ''}
                  <span style="${font(caption)}padding:${space('3xs')} ${space('xs')};border-radius:${radius('2xs')};border:${stroke} solid var(--pv-border);background:${v(bgL1Id)};color:var(--pv-text)">篩選條件：3 項</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div class="pv-semantic" style="margin-top:${space('sm')}">
      ${bgLayerTokens.map((t) => {
        const isElevated = t.path.at(-1).includes('elevated')
        const isBackdrop = t.path.at(-1) === 'backdrop'
        const fg = readableOn(val(t.id))
        return `
          <div class="pv-sem" ${jump(t.id)} style="background:${v(t.id)};color:${fg};border:${stroke} solid var(--pv-border);${isElevated ? `box-shadow:${elev('md')};` : ''}">
            <strong>${esc(t.path.slice(1).join('.'))}</strong>
            <span>${esc(formatValue('color', val(t.id)))} → ${esc(refOf(t.node.$value) ?? '自訂值')}</span>
            ${isElevated ? '<span class="pv-badge">+ system.elevation.md</span>' : ''}
            ${isBackdrop ? '<span class="pv-badge">Modal / Drawer Scrim</span>' : ''}
          </div>`
      }).join('')}
    </div>

    ${bgInteractiveTokens.length ? `
      <h3 class="pv-sub">System · 互動表面狀態（Interactive Surface States · 高密度資料表格與清單列）</h3>
      <div class="pv-semantic">
        ${bgInteractiveTokens.map((t) => `
          <div class="pv-sem" ${jump(t.id)} style="background:${v(t.id)};color:var(--pv-text);border:${stroke} solid var(--pv-border);">
            <strong>${esc(t.path.slice(1).join('.'))}</strong>
            <span>${esc(formatValue('color', val(t.id)))} → ${esc(refOf(t.node.$value) ?? '自訂值')}</span>
            ${txtPrimaryId ? contrastBadge(txtPrimaryId, t.id) : ''}
          </div>`).join('')}
      </div>
      <div class="pv-bom-demo" style="border-radius:${radius('xs')};border:${stroke} solid var(--pv-border);background:${v(bgL2Id, 'var(--pv-surface)')}">
        <div class="pv-bom-row" style="background:${v(bgL1Id)};padding:${space('3xs')} ${space('sm')};border-bottom:${stroke} solid var(--pv-border);${font(labelXs)}color:var(--pv-muted)">
          <span>識別碼 (mono.xs)</span><span>項目名稱 Item Name（Hover / 點按檢視狀態）</span><span style="text-align:right">數值 (.tabular-nums)</span><span>狀態 Status</span><span>表面 Token</span>
        </div>
        <div class="pv-bom-row pv-bom-row--interactive" ${jump(bgHoverId)} style="--row-bg:${v(bgL2Id)};--row-bg-hover:${v(bgHoverId)};--row-bg-active:${v(bgActiveId)};padding:${space('2xs')} ${space('sm')};border-bottom:${stroke} solid ${v('system.border.subtle', 'var(--pv-border)')};${font(bodySm)}">
          <span ${jump(monoXs)} style="${font(monoXs)}color:var(--pv-text)">ID-8042-A</span><span>Core API Gateway</span><span class="tabular-nums" style="text-align:right">12.05 ms</span><span>${pairFor('success') ? badge(pairFor('success')) : ''}</span><code>layer-2 → hover</code>
        </div>
        <div class="pv-bom-row pv-bom-row--interactive" ${jump(bgSelectedId)} style="--row-bg:${v(bgSelectedId)};--row-bg-hover:${v(bgSelectedHoverId)};--row-bg-active:${v(bgSelectedHoverId)};padding:${space('2xs')} ${space('sm')};border-bottom:${stroke} solid ${v('system.border.subtle', 'var(--pv-border)')};${font(bodySm)}">
          <span ${jump(monoXs)} style="${font(monoXs)}color:var(--pv-text)">ID-8049-B</span><span><strong>✦ 已選取項目：Auth Token Service</strong></span><span class="tabular-nums" style="text-align:right">108.40 ms</span><span>${pairFor('primary') ? badge(pairFor('primary')) : ''}</span><code>selected → hover</code>
        </div>
        <div class="pv-bom-row pv-bom-row--interactive" ${jump(bgHoverId)} style="--row-bg:${v(bgL2Id)};--row-bg-hover:${v(bgHoverId)};--row-bg-active:${v(bgActiveId)};padding:${space('2xs')} ${space('sm')};${font(bodySm)}">
          <span ${jump(monoXs)} style="${font(monoXs)}color:var(--pv-text)">ID-8053-C</span><span>Batch Sync Worker</span><span class="tabular-nums" style="text-align:right">9.10 ms</span><span>${pairFor('warning') ? badge(pairFor('warning')) : ''}</span><code>layer-2 → hover</code>
        </div>
      </div>` : ''}` : ''

  const textTokens = byType('color').filter((t) => t.path[0] === 'system' && t.path[1] === 'text')
  const borderColorTokens = byType('color').filter((t) => t.path[0] === 'system' && t.path[1] === 'border')
  const textAndBorderHtml = (textTokens.length || borderColorTokens.length) ? `
    <h3 class="pv-sub">System · 文字與邊框語意色（Text & Border on Layer-2 · APCA Lc 對比）</h3>
    <div class="pv-semantic">
      ${textTokens.map((t) => `
        <div class="pv-sem" ${jump(t.id)} style="background:${v(bgL2Id, 'var(--pv-surface)')};color:${v(t.id)};border:${stroke} solid var(--pv-border);">
          <strong>${esc(t.path.slice(1).join('.'))}</strong>
          <span>${esc(formatValue('color', val(t.id)))} → ${esc(refOf(t.node.$value) ?? '自訂值')}</span>
          ${bgL2Id ? contrastBadge(t.id, bgL2Id) : ''}
        </div>`).join('')}
      ${borderColorTokens.map((t) => `
        <div class="pv-sem" ${jump(t.id)} style="background:${v(bgL2Id, 'var(--pv-surface)')};color:var(--pv-text);border:2px solid ${v(t.id)};">
          <strong>${esc(t.path.slice(1).join('.'))}</strong>
          <span>${esc(formatValue('color', val(t.id)))} → ${esc(refOf(t.node.$value) ?? '自訂值')}</span>
          ${bgL2Id ? contrastBadge(t.id, bgL2Id) : `<span class="pv-badge" style="border:1px solid ${v(t.id)};background:transparent;color:var(--pv-text)">border 2px</span>`}
        </div>`).join('')}
    </div>` : ''

  const semantic = pairs.length ? `
    <h3 class="pv-sub">System · 實心語意與互動狀態（Solid Semantic Roles · 字淺背景深 & Hover / Active）</h3>
    <div class="pv-semantic">
      ${pairs.map(({ bg, on, hover, active }) => `
        <div class="pv-sem" ${jump(bg.id)} style="background:${v(bg.id)};color:${v(on.id)}">
          <strong>${esc(bg.path.at(-1))}</strong>
          <span>${esc(formatValue('color', val(bg.id)))} → ${esc(refOf(bg.node.$value) ?? '自訂值')}</span>
          <span>on-${esc(bg.path.at(-1))} → ${esc(refOf(on.node.$value) ?? formatValue('color', val(on.id)))}</span>
          ${(hover || active) ? `<div class="pv-sem-states">
            ${hover ? `<div class="pv-sem-state-chip" ${jump(hover.id)} style="background:${v(hover.id)};color:${v(on.id)}" title="${esc(hover.id)}: ${esc(refOf(hover.node.$value) ?? '')}">hover · ${esc((refOf(hover.node.$value) ?? '').split('.').at(-1))}</div>` : ''}
            ${active ? `<div class="pv-sem-state-chip" ${jump(active.id)} style="background:${v(active.id)};color:${v(on.id)}" title="${esc(active.id)}: ${esc(refOf(active.node.$value) ?? '')}">active · ${esc((refOf(active.node.$value) ?? '').split('.').at(-1))}</div>` : ''}
          </div>` : ''}
          ${contrastBadge(on.id, bg.id)}
        </div>`).join('')}
    </div>
    ${pairs.some((p) => p.subtle && p.onSubtle) ? `
      <h3 class="pv-sub">System · 柔和狀態容器與同色系標籤（Subtle Status Containers · X-subtle / on-X-subtle / X-border）</h3>
      <div class="pv-semantic">
        ${pairs.filter((p) => p.subtle && p.onSubtle).map(({ bg, subtle, onSubtle, border }) => {
          const name = bg.path.at(-1)
          return `
            <div class="pv-sem" ${jump(subtle.id)} style="background:${v(subtle.id)};color:${v(onSubtle.id)};border:2px solid ${border ? v(border.id) : 'transparent'}">
              <strong>${esc(name)}-subtle</strong>
              <span>bg → ${esc(refOf(subtle.node.$value) ?? formatValue('color', val(subtle.id)))} (${esc(formatValue('color', val(subtle.id)))})</span>
              <span ${jump(onSubtle.id)}>text → ${esc(refOf(onSubtle.node.$value) ?? formatValue('color', val(onSubtle.id)))}</span>
              ${border ? `<span ${jump(border.id)}>border → ${esc(refOf(border.node.$value) ?? formatValue('color', val(border.id)))}</span>` : ''}
              ${contrastBadge(onSubtle.id, subtle.id)}
              ${bgL2Id ? `<span class="pv-sem-sub" title="當 on-${esc(name)}-subtle 作為文字置於 layer-2 畫布上時的 APCA 對比">text on layer-2: Lc ${Math.abs(apcaContrast(val(onSubtle.id), val(bgL2Id))).toFixed(1)} (${apcaLevel(apcaContrast(val(onSubtle.id), val(bgL2Id))).tier})</span>` : ''}
            </div>`
        }).join('')}
      </div>` : ''}` : ''

  const rawColors = inFile('color').filter((t) => t.type === 'color' && !refOf(t.node.$value))
  const groups = new Map()
  for (const t of rawColors) {
    const key = t.path.slice(0, -1).join('.')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(t)
  }
  const palettes = [...groups].filter(([, list]) => list.length >= 3)
  const singles = [...groups].filter(([, list]) => list.length < 3).flatMap(([, list]) => list)

  const swatchContrastMode = ctx.swatchContrastMode ?? 'lc-white'
  const contrastModes = [
    ['lc-white', 'APCA vs #fff'],
    ['lc-black', 'APCA vs #000'],
    ['wcag-white', 'WCAG vs #fff'],
    ['none', '隱藏對比值']
  ]

  const formatSwatchContrast = (lcWhite, lcBlack, ratioWhite) => {
    switch (swatchContrastMode) {
      case 'lc-white': return `<span>Lc ${lcWhite.toFixed(0)}</span>`
      case 'lc-black': return `<span>Lc ${lcBlack.toFixed(0)}</span>`
      case 'wcag-white': return `<span>${ratioWhite.toFixed(2)}:1</span>`
      case 'none':
      default: return ''
    }
  }

  const palettesHtml = `
    <div class="pv-sub-row">
      <h3 class="pv-sub">Global · 色票（Hover 檢視完整對比）</h3>
      <div class="pv-contrast-ctrl">
        <span>色票對比文字：</span>
        <div class="seg" role="group" aria-label="色票對比文字顯示">
          ${contrastModes.map(([mode, text]) => `<button type="button" data-swatch-contrast="${mode}" class="${swatchContrastMode === mode ? 'active' : ''}">${text}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="pv-palettes">
      ${palettes.map(([key, list]) => `
        <div class="pv-palette">
          <code class="pv-palette-name">${esc(key.split('.').at(-1))}</code>
          <div class="pv-palette-row">
            ${list.map((t) => {
              const value = val(t.id)
              const lcWhite = Math.abs(apcaContrast(value, '#ffffff'))
              const lcBlack = Math.abs(apcaContrast(value, '#000000'))
              const ratio = contrast(value, '#ffffff')
              return `<div class="pv-shade" ${jump(t.id)} title="${esc(t.id)} · vs #fff: Lc ${lcWhite.toFixed(1)} (${ratio.toFixed(2)}:1) · vs #000: Lc ${lcBlack.toFixed(1)}" style="background:${v(t.id)};color:${readableOn(value)}">
                <b>${esc(t.path.at(-1))}</b><span>${esc(colorValueToHex(value))}</span>${formatSwatchContrast(lcWhite, lcBlack, ratio)}
              </div>`
            }).join('')}
          </div>
        </div>`).join('')}
      ${singles.length ? `<div class="pv-palette"><code class="pv-palette-name">other</code><div class="pv-palette-row pv-palette-row--auto">
        ${singles.map((t) => `<div class="pv-shade" ${jump(t.id)} style="background:${v(t.id)};color:${readableOn(val(t.id))}"><b>${esc(t.path.slice(1).join('.'))}</b><span>${esc(formatValue('color', val(t.id)))}</span></div>`).join('')}
      </div></div>` : ''}
    </div>`

  // =========================================================
  // 3. Typography
  // =========================================================
  const typeSpecimens = typos.map((t) => {
    const isMono = t.path.includes('mono')
    const sample = isMono
      ? 'ID-2026-0048 · v2.1.0 · 0O1lI · 12.05 ms'
      : '設計系統讓產品保持一致 The quick brown fox jumps over the lazy dog'
    return `
    <div class="pv-type" ${jump(t.id)}>
      <div class="pv-type-meta"><code>${esc(t.path.slice(1).join('.'))}</code><span>${esc(formatValue('typography', val(t.id) ?? {}))}</span></div>
      <div style="${font(t.id)}color:var(--pv-text)">${sample}</div>
    </div>`
  }).join('')

  const numericCompareHtml = `
    <h3 class="pv-sub">等寬字體與對齊數字排版對照（system.font.mono vs .tabular-nums）</h3>
    <div class="pv-num-compare">
      <div class="pv-num-card" ${jump(monoSm)}>
        <h4>1. 等寬字體 <code>system.font.mono.sm</code>（識別碼 / 版本號 / 雜湊值）</h4>
        <div class="pv-num-lines" style="${font(monoSm)}color:var(--pv-text)">
          <span>ID-2026-0011 · v1.0.4</span>
          <span>ID-2026-8840 · v12.8.0</span>
          <span>SHA-256: 0O1lI-9f4e2c8a</span>
        </div>
      </div>
      <div class="pv-num-card" ${jump(bodySm)}>
        <h4>2. 無襯線 + <code>.tabular-nums</code>（表格數值 / 統計 / 百分比垂直對齊）</h4>
        <div class="pv-num-lines tabular-nums" style="${font(bodySm)}color:var(--pv-text)">
          <span>11,111.10 · 12.05 ms (99.1%)</span>
          <span>88,888.85 · 98.40 ms (84.5%)</span>
          <span>20,409.00 · 10.00 ms (100.0%)</span>
        </div>
      </div>
      <div class="pv-num-card" ${jump(bodySm)}>
        <h4>3. 一般比例數字（未加 <code>.tabular-nums</code>，小數點無法垂直對齊）</h4>
        <div class="pv-num-lines" style="${font(bodySm)}color:var(--pv-muted)">
          <span>11,111.10 · 12.05 ms (99.1%)</span>
          <span>88,888.85 · 98.40 ms (84.5%)</span>
          <span>20,409.00 · 10.00 ms (100.0%)</span>
        </div>
      </div>
    </div>`

  const fontSizes = all.filter((t) => t.type === 'dimension' && t.id.includes('font.size') && !isSystem(t))
  const sizeScale = fontSizes.length ? `
    <h3 class="pv-sub">Global · 字級尺度</h3>
    <div class="pv-scale-type">
      ${fontSizes.map((t) => `<div ${jump(t.id)}><span style="font-size:${v(t.id)};line-height:1.1;color:var(--pv-text)">Aa 字</span><code>${esc(t.path.at(-1))} · ${esc(formatValue('dimension', val(t.id)))}</code></div>`).join('')}
    </div>` : ''

  const weights = all.filter((t) => t.type === 'fontWeight' && !isSystem(t))
  const weightScale = weights.length ? `
    <h3 class="pv-sub">Global · 字重</h3>
    <div class="pv-row" style="gap:24px">
      ${weights.map((t) => `<div ${jump(t.id)} class="pv-weight"><span style="font-weight:${v(t.id)};font-size:28px;color:var(--pv-text)">Ag 永</span><code>${esc(t.path.at(-1))} · ${esc(val(t.id))}</code></div>`).join('')}
    </div>` : ''

  // =========================================================
  // 4. Spacing / sizing / border / elevation
  // =========================================================
  const bars = (list) => list.map((t) => `
    <div class="pv-bar-row" ${jump(t.id)}>
      <code>${esc(t.path.slice(1).join('.'))}</code>
      <div class="pv-bar" style="width:${v(t.id)}"></div>
      <span>${esc(formatValue(t.type, val(t.id)))}</span>
    </div>`).join('')

  const spacing = inFile('spacing').filter((t) => t.type === 'dimension')
  const spacingDemo = has('system.spacing.md') ? `
    <div class="pv-spacing-demo">
      ${['xs', 'sm', 'md', 'lg', 'xl'].filter((s) => has(`system.spacing.${s}`)).map((s) => `
        <div ${jump(`system.spacing.${s}`)}>
          <div class="pv-pad" style="padding:${space(s)}"><div></div></div>
          <code>padding: ${s}</code>
        </div>`).join('')}
    </div>` : ''

  const sizing = inFile('sizing').filter((t) => t.type === 'dimension')
  const controlHeights = sizing.filter((t) => t.path.includes('control'))
  const iconSizes = sizing.filter((t) => t.path.includes('icon'))
  const systemSizes = sizing.filter((t) => isSystem(t) && !t.path.includes('control') && !t.path.includes('icon'))
  const globalSizes = sizing.filter((t) => !isSystem(t))
  const densityLabels = {
    xs: 'Ultra-Compact (24px · 內嵌動作 / 樹狀節點)',
    sm: 'Compact (28px · 高密度資料列 / 緊湊工具列)',
    md: 'Default (32px · 標準控制項 / 資料表格列)',
    lg: 'Comfortable (36px · 表單對話框控制項)',
    xl: 'Spacious (40px · 頂部主要操作列)'
  }
  const iconRoleLabels = {
    xs: '12px · 展開箭頭 / 狀態徽章內嵌圖示',
    sm: '16px · 高密度工具列 / 表格列動作 (配 control.height.xs–sm)',
    md: '20px · 標準按鈕與側欄導覽圖示 (配 control.height.md–lg)',
    lg: '24px · 頂部主工具列 / 對話框標題圖示 (配 control.height.xl)',
    xl: '32px · 空白狀態 (Empty State) / 區塊引導圖示'
  }
  const controlDensityHtml = controlHeights.length ? `
    <h3 class="pv-sub">System · 控制項與列高密度階層（system.control.height.*）</h3>
    <div class="pv-stack" style="gap:${space('xs')};margin-bottom:${space('md')}">
      ${controlHeights.map((t) => {
        const key = t.path.at(-1)
        const rad = key === 'xs' ? radius('2xs') : key === 'sm' ? radius('xs') : radius('sm')
        return `
        <div class="pv-row" ${jump(t.id)} style="gap:${space('sm')}">
          <div style="height:${v(t.id)};padding:0 ${space('sm')};border-radius:${rad};border:${stroke} solid var(--pv-border);background:var(--pv-surface);display:inline-flex;align-items:center;gap:${space('xs')};${font(bodySm)}color:var(--pv-text)">
            <span style="${font(monoXs)}color:var(--pv-muted)">${esc(key)}</span>
            <span>${esc(densityLabels[key] ?? key)}</span>
          </div>
          <code>${esc(t.path.slice(1).join('.'))} · ${esc(formatValue('dimension', val(t.id)))}</code>
        </div>`
      }).join('')}
    </div>` : ''
  const iconSizingHtml = iconSizes.length ? `
    <h3 class="pv-sub">System · 圖示尺寸語意階層（system.icon.size.*）</h3>
    <div class="pv-stack" style="gap:${space('xs')};margin-bottom:${space('md')}">
      ${iconSizes.map((t) => {
        const key = t.path.at(-1)
        return `
        <div class="pv-row" ${jump(t.id)} style="gap:${space('sm')}">
          <div style="padding:${space('2xs')} ${space('xs')};border-radius:${radius('xs')};border:${stroke} solid var(--pv-border);background:var(--pv-surface);display:inline-flex;align-items:center;justify-content:center;color:var(--pv-text)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:${v(t.id)};height:${v(t.id)};flex-shrink:0">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <code>${esc(t.path.slice(1).join('.'))} · ${esc(formatValue('dimension', val(t.id)))}</code>
          <span style="${font(bodySm)}color:var(--pv-muted)">${esc(iconRoleLabels[key] ?? '')}</span>
        </div>`
      }).join('')}
    </div>` : ''
  const squares = (list) => `<div class="pv-squares">${list.map((t) => `
    <div ${jump(t.id)}><div class="pv-square" style="width:${v(t.id)};height:${v(t.id)}"></div>
    <code>${esc(t.path.slice(1).join('.'))}</code><span>${esc(formatValue('dimension', val(t.id)))}</span></div>`).join('')}</div>`

  const borderTokens = inFile('border')
  const radii = borderTokens.filter((t) => t.path.includes('radius'))
  const focusTokens = borderTokens.filter((t) => t.path.includes('focus'))
  const widths = borderTokens.filter((t) => t.type === 'dimension' && t.path.includes('width') && !t.path.includes('focus'))
  const offsets = borderTokens.filter((t) => t.type === 'dimension' && t.path.includes('offset') && !t.path.includes('focus'))
  const styles = borderTokens.filter((t) => t.type === 'strokeStyle' && !t.path.includes('focus'))
  const focusColorCss = v('system.border.focus', '#3b63fb')
  const focusWidthCss = v('system.focus.width', '2px')
  const focusStyleCss = v('system.focus.style', 'solid')
  const focusRingHtml = focusTokens.length ? `
    <h3 class="pv-sub">System · 無障礙焦點環幾何規範（system.focus.* + system.border.focus）</h3>
    <div class="pv-row" style="gap:${space('md')};margin-bottom:${space('md')}">
      <div ${jump('system.focus.offset.default')} style="padding:${space('xs')} ${space('md')};border-radius:${radius('sm')};background:var(--pv-surface);border:${stroke} solid var(--pv-border);outline:${focusWidthCss} ${focusStyleCss} ${focusColorCss};outline-offset:${v('system.focus.offset.default', '2px')};${font(bodySm)}color:var(--pv-text)">
        <strong>offset.default (+2px)</strong> · 獨立按鈕與控制項外擴焦點環
      </div>
      <div ${jump('system.focus.offset.flush')} style="padding:${space('xs')} ${space('md')};border-radius:${radius('sm')};background:var(--pv-surface);border:${stroke} solid var(--pv-border);outline:${focusWidthCss} ${focusStyleCss} ${focusColorCss};outline-offset:${v('system.focus.offset.flush', '0px')};${font(bodySm)}color:var(--pv-text)">
        <strong>offset.flush (0px)</strong> · 輸入框與停靠面板貼齊焦點環
      </div>
      <div ${jump('system.focus.offset.inset')} style="padding:${space('xs')} ${space('md')};border-radius:${radius('2xs')};background:var(--pv-surface);border:${stroke} solid var(--pv-border);outline:${focusWidthCss} ${focusStyleCss} ${focusColorCss};outline-offset:${v('system.focus.offset.inset', '-2px')};${font(bodySm)}color:var(--pv-text)">
        <strong>offset.inset (-2px)</strong> · 高密度表格儲存格與清單內縮焦點環（防裁切）
      </div>
    </div>` : ''
  const borderHtml = `
    ${focusRingHtml}
    <h3 class="pv-sub">Border Radius（含 none 0px / 2xs 2px 高密度圓角）</h3>
    <div class="pv-squares">${radii.map((t) => `
      <div ${jump(t.id)}><div class="pv-radius" style="border-radius:${v(t.id)}"></div>
      <code>${esc(t.path.slice(1).join('.'))}</code><span>${esc(formatValue('dimension', val(t.id)))}</span></div>`).join('')}</div>
    <h3 class="pv-sub">Border Width（統一命名為 border.width.*）</h3>
    <div class="pv-squares">${widths.map((t) => `
      <div ${jump(t.id)}><div class="pv-stroke" style="border-width:${v(t.id)}"></div>
      <code>${esc(t.path.slice(1).join('.'))}</code><span>${esc(formatValue('dimension', val(t.id)))}</span></div>`).join('')}</div>
    ${offsets.length ? `
    <h3 class="pv-sub">Global · Outline Offset（global.border.offset.*）</h3>
    <div class="pv-squares">${offsets.map((t) => `
      <div ${jump(t.id)}><div class="pv-stroke" style="border-width:1px;outline:2px solid ${focusColorCss};outline-offset:${v(t.id)}"></div>
      <code>${esc(t.path.slice(1).join('.'))}</code><span>${esc(formatValue('dimension', val(t.id)))}</span></div>`).join('')}</div>` : ''}
    <h3 class="pv-sub">Border Style（border.style.*）</h3>
    <div class="pv-squares">${styles.map((t) => `
      <div ${jump(t.id)}><div class="pv-stroke" style="border-style:${v(t.id)};border-width:3px"></div>
      <code>${esc(t.path.slice(1).join('.'))}</code></div>`).join('')}</div>`

  // Elevation: system composite shadows + z-index + global offset/blur/spread
  const shadows = byType('shadow')
  const zIndexTokens = inFile('elevation').filter((t) => t.path.includes('z-index'))
  const sysZIndex = zIndexTokens.filter(isSystem)
  const globalZIndex = zIndexTokens.filter((t) => !isSystem(t))
  const zRoles = {
    base: '預設文件流 (0)',
    docked: '固定表頭 / 凍結欄位 (10)',
    dropdown: '下拉選單 / 自動完成 (100)',
    sticky: '浮動工具列 / Sticky Header (200)',
    drawer: '側邊屬性面板 Drawer (300)',
    modal: '對話框視窗 Modal (400)',
    popover: '情境彈出面板 Popover (500)',
    toast: '全域通知 Toast (600)'
  }
  const elevationDims = inFile('elevation').filter((t) => t.type === 'dimension')
  const elevationHtml = `
    ${shadows.length ? `
      <h3 class="pv-sub">System · 複合陰影樣式（亮暗模式自適應陰影深度 system.shadow.color.*）</h3>
      <div class="pv-elevations">
        ${shadows.map((t) => `
          <div class="pv-elev" style="box-shadow:${v(t.id)};border-radius:${radius('lg')}" ${jump(t.id)}>
            <strong>${esc(t.path.at(-1))}</strong>
            <code>${esc(formatValue('shadow', val(t.id) ?? {})).replaceAll(' · ', '\n')}</code>
          </div>`).join('')}
      </div>` : ''}
    ${sysZIndex.length ? `
      <h3 class="pv-sub">System · 圖層堆疊階層（system.z-index.*）</h3>
      <div class="pv-z-grid">
        ${sysZIndex.map((t) => {
          const key = t.path.at(-1)
          return `
          <div class="pv-z-card" ${jump(t.id)}>
            <strong>z-index.${esc(key)} · ${esc(val(t.id))}</strong>
            <span>${esc(zRoles[key] ?? '')}</span>
            <code>← ${esc(refOf(t.node.$value) ?? '自訂值')}</code>
          </div>`
        }).join('')}
      </div>` : ''}
    ${globalZIndex.length ? `
      <h3 class="pv-sub">Global · Z-Index 原始尺度</h3>
      <div class="pv-z-grid">
        ${globalZIndex.map((t) => `
          <div class="pv-z-card" ${jump(t.id)}>
            <strong>${esc(t.path.slice(1).join('.'))}</strong>
            <span>z-index: ${esc(val(t.id))}</span>
          </div>`).join('')}
      </div>` : ''}
    ${elevationDims.length ? `
      <h3 class="pv-sub">Global · Offset / Blur / Spread</h3>
      ${bars(elevationDims)}` : ''}`

  // =========================================================
  // 5. Motion (Duration & Easing)
  // =========================================================
  const motionTokens = inFile('motion')
  const durations = motionTokens.filter((t) => t.type === 'duration')
  const easings = motionTokens.filter((t) => t.type === 'cubicBezier')
  const durationRow = (t) => `
    <div class="pv-motion-row" ${jump(t.id)}>
      <code>${esc(t.path.slice(1).join('.'))}</code>
      <div class="pv-motion-track"><div class="pv-motion-puck" style="--m-dur:${v(t.id)}"></div></div>
      <span style="font:11px var(--ui-mono);color:var(--pv-muted)">${esc(formatValue('duration', val(t.id)))}${refOf(t.node.$value) ? ` ← ${esc(refOf(t.node.$value))}` : ''}</span>
    </div>`
  const easingRow = (t) => `
    <div class="pv-motion-row" ${jump(t.id)}>
      <code>${esc(t.path.slice(1).join('.'))}</code>
      <div class="pv-motion-track"><div class="pv-motion-puck" style="--m-dur:200ms;--m-ease:${v(t.id)}"></div></div>
      <span style="font:11px var(--ui-mono);color:var(--pv-muted)">${esc(formatValue('cubicBezier', val(t.id)))}</span>
    </div>`
  const motionHtml = motionTokens.length ? `
    <h3 class="pv-sub">System · 轉場時間（Hover 檢視真實動畫速度）</h3>
    <div class="pv-motion-list">${durations.filter(isSystem).map(durationRow).join('')}</div>
    <h3 class="pv-sub">System · 緩動曲線（Hover 比較加速與減速曲線）</h3>
    <div class="pv-motion-list">${easings.filter(isSystem).map(easingRow).join('')}</div>
    <h3 class="pv-sub">Global · Duration & Easing 原始尺度</h3>
    <div class="pv-motion-list">
      ${durations.filter((t) => !isSystem(t)).map(durationRow).join('')}
      ${easings.filter((t) => !isSystem(t)).map(easingRow).join('')}
    </div>` : ''

  root.innerHTML = canvasVars + [
    section('ui', 'UI 範例', uiSample, '以 System token 組合而成的元件範例'),
    section('color', '色彩 Color', bgLayersHtml + textAndBorderHtml + semantic + palettesHtml),
    section('typography', '字體 Typography', `<h3 class="pv-sub">System · 複合字體樣式</h3>${typeSpecimens}${numericCompareHtml}${sizeScale}${weightScale}`),
    section('spacing', '間距 Spacing', `${spacingDemo}<h3 class="pv-sub">System</h3>${bars(spacing.filter(isSystem))}<h3 class="pv-sub">Global</h3>${bars(spacing.filter((t) => !isSystem(t)))}`),
    section('sizing', '尺寸 Sizing', `${controlDensityHtml}${iconSizingHtml}<h3 class="pv-sub">System · 基礎尺寸（system.size.*）</h3>${squares(systemSizes)}<h3 class="pv-sub">Global</h3>${squares(globalSizes)}`),
    section('border', '邊框 Border', borderHtml),
    section('elevation', '陰影與圖層 Elevation & Z-Index', elevationHtml),
    motionHtml ? section('motion', '動態 Motion', motionHtml, '將滑鼠移至軌道上方即可即時預覽各個 Duration 與 Cubic-Bezier 曲線的動態表現') : ''
  ].join('')
}
