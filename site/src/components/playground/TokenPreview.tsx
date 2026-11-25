import { useState, type CSSProperties, type ReactNode } from 'react'
import { colorValueToHex } from '@pact-design/tokens/utils/color.js'
import { apcaContrast, apcaLevel, contrast, readableOn, wcagLevel } from '@pact-design/tokens/utils/contrast.js'
import { categoryOf, cssName, formatValue, refOf } from '@pact-design/tokens/utils/token.js'
import {
  Badge,
  Button,
  Checkbox,
  Menu,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
  type MenuItemData
} from '@pact-design/react'
import { RiMoonLine, RiSideBarFill, RiSideBarLine, RiSunLine } from '@remixicon/react'
import { apcaTone } from './TokenEditor'
import type { ContrastMode, ResolvedTokenEntry, ThemeMode, Token, TokenValue } from '../../types/tokens'

const DENSITY_LABELS: Record<string, string> = {
  xs: 'Ultra-Compact (24px · 內嵌動作 / 樹狀節點)',
  sm: 'Compact (28px · 高密度資料列 / 緊湊工具列)',
  md: 'Default (32px · 標準控制項 / 資料表格列)',
  lg: 'Comfortable (36px · 表單對話框控制項)',
  xl: 'Spacious (40px · 頂部主要操作列)'
}

const ICON_ROLE_LABELS: Record<string, string> = {
  xs: '12px · 展開箭頭 / 狀態徽章內嵌圖示',
  sm: '16px · 高密度工具列 / 表格列動作 (配 control.height.xs–sm)',
  md: '20px · 標準按鈕與側欄導覽圖示 (配 control.height.md–lg)',
  lg: '24px · 頂部主工具列 / 對話框標題圖示 (配 control.height.xl)',
  xl: '32px · 空白狀態 (Empty State) / 區塊引導圖示'
}

const Z_ROLES: Record<string, string> = {
  base: '預設文件流 (0)',
  docked: '固定表頭 / 凍結欄位 (10)',
  dropdown: '下拉選單 / 自動完成 (100)',
  sticky: '浮動工具列 / Sticky Header (200)',
  drawer: '側邊屬性面板 Drawer (300)',
  modal: '對話框視窗 Modal (400)',
  popover: '情境彈出面板 Popover (500)',
  toast: '全域通知 Toast (600)'
}

const CONTRAST_MODES: ReadonlyArray<readonly [ContrastMode, string]> = [
  ['lc-white', 'APCA vs #fff'],
  ['lc-black', 'APCA vs #000'],
  ['wcag-white', 'WCAG vs #fff'],
  ['none', '隱藏對比值']
]

interface SemanticColorPair {
  bg: Token
  on: Token
  hover?: Token
  active?: Token
  subtle?: Token
  onSubtle?: Token
  text?: Token
  border?: Token
  borderStrong?: Token
}

interface ContrastBadgeProps {
  txtVal: TokenValue | undefined
  bgVal: TokenValue | undefined
}

function ContrastBadge({ txtVal, bgVal }: ContrastBadgeProps) {
  const lc = apcaContrast(txtVal, bgVal)
  const apca = apcaLevel(lc)
  const ratio = contrast(txtVal, bgVal)
  const wcag = wcagLevel(ratio)
  const sign = lc > 0 ? `+${lc.toFixed(1)}` : lc.toFixed(1)

  return (
    <Badge
      tone={apcaTone(apca.css)}
      size="xs"
      title={`APCA: Lc ${sign} (${apca.usage}) · WCAG 2.1: ${ratio.toFixed(2)}:1 (${wcag})`}
      className="w-fit font-mono font-medium"
    >
      <span>Lc {Math.abs(lc).toFixed(1)} · {apca.tier}</span>
      <small className="opacity-75">({ratio.toFixed(1)}:1)</small>
    </Badge>
  )
}

interface PreviewSectionProps {
  id: string
  title: string
  note?: string
  children: ReactNode
}

function PreviewSection({ id, title, note, children }: PreviewSectionProps) {
  return (
    <section
      id={`pv-${id}`}
      className="flex flex-col gap-md p-md rounded-sm bg-layer-1 border-sm border-border-default"
    >
      <header className="flex flex-col gap-3xs pb-xs border-b border-border-subtle">
        <h2 className="text-heading-xs text-on-surface m-0">{title}</h2>
        {note && <p className="text-caption-md text-on-surface-muted m-0">{note}</p>}
      </header>
      {children}
    </section>
  )
}

interface MotionRowProps {
  token: Token
  resolvedVal: TokenValue | undefined
  isDuration: boolean
  onJump: (id?: string) => void
}

function MotionRow({ token, resolvedVal, isDuration, onJump }: MotionRowProps) {
  const [hovered, setHovered] = useState(false)
  const vCss = `var(${cssName(token.id)})`
  const ref = refOf(token.node.$value)

  return (
    <div
      onClick={() => onJump(token.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={token.id}
      className="grid grid-cols-[12rem_1fr_12rem] items-center gap-sm px-sm py-xs rounded-xs bg-layer-2 border-sm border-border-subtle hover:border-border-strong cursor-pointer"
    >
      <code className="text-mono-xs text-on-surface truncate">
        {token.path.filter((seg) => seg !== '$root').slice(2).join('.')}
      </code>
      <div className="relative h-5 rounded-full bg-layer-1 border-sm border-border-default overflow-hidden p-3xs flex items-center">
        <div
          className="w-3.5 h-3.5 rounded-full bg-primary"
          style={{
            transform: hovered ? 'translateX(calc(100cqw - 100%))' : 'translateX(0)',
            transitionProperty: 'transform',
            transitionDuration: isDuration ? vCss : '250ms',
            transitionTimingFunction: isDuration ? `var(${cssName('pd.system.motion.easing.$root')}, ease)` : vCss
          }}
        />
      </div>
      <span className="text-mono-xs text-on-surface-muted truncate text-right">
        {formatValue(token.type, resolvedVal)}
        {ref ? ` ← ${ref}` : ''}
      </span>
    </div>
  )
}

export interface TokenPreviewProps {
  tokens: Map<string, Token>
  resolved: Map<string, ResolvedTokenEntry>
  theme: ThemeMode
  sidebarCollapsed: boolean
  swatchContrastMode: ContrastMode
  onToggleSidebar: () => void
  onThemeChange: (theme: ThemeMode) => void
  onSwatchContrastChange: (mode: ContrastMode) => void
  onJump: (id?: string) => void
}

export function TokenPreview({
  tokens,
  resolved,
  theme,
  sidebarCollapsed,
  swatchContrastMode,
  onToggleSidebar,
  onThemeChange,
  onSwatchContrastChange,
  onJump
}: TokenPreviewProps) {
  const [sampleEmail, setSampleEmail] = useState('hello@pactdesign.dev')
  const [sampleCompact, setSampleCompact] = useState(true)
  const [sampleApca, setSampleApca] = useState(true)

  const all = [...tokens.values()]
  const has = (id?: string): id is string => !!id && tokens.has(id)
  const pick = (...ids: string[]): string | undefined => ids.find(has)
  const val = (id?: string): TokenValue | undefined => (id ? resolved.get(id)?.value : undefined)
  const v = (id?: string, fallback = ''): string =>
    has(id) ? `var(${cssName(id)}${fallback ? `, ${fallback}` : ''})` : fallback
  const byType = (type: string): Token[] => all.filter((t) => t.type === type)
  const inFile = (word: string): Token[] => all.filter((t) => categoryOf(t.file) === word)
  const isSystem = (t: Token): boolean => t.path[1] === 'system'
  const cleanPath = (t: Token): string[] => t.path.filter((seg) => seg !== '$root')
  const displayPath = (t: Token): string => cleanPath(t).slice(2).join('.')
  const leafName = (t: Token): string => cleanPath(t).at(-1) ?? ''

  const typos = byType('typography')
  const pickTypo = (role: string, size: string): string | undefined =>
    typos.find((t) => t.path.includes(role) && leafName(t) === size)?.id ??
    typos.find((t) => t.path.includes(role))?.id

  const fontStyle = (id?: string): CSSProperties => {
    if (!has(id)) return {}
    const n = cssName(id)
    return {
      font: `var(${n})`,
      letterSpacing: `var(${n}-letter-spacing)`
    }
  }

  // Semantic colour pairs (pd.system.color.<role>.$root / on-<role>.$root / hover / active / subtle / on-subtle / border)
  const pairs: SemanticColorPair[] = byType('color')
    .filter((t) => t.path[1] === 'system' && t.path[2] === 'color' && t.path.length === 5 && t.path[4] === '$root')
    .map((t): SemanticColorPair | null => {
      const name = t.path[3]
      if (!name || name.startsWith('on-')) return null
      const on = tokens.get(`pd.system.color.on-${name}.$root`)
      if (!on) return null
      return {
        bg: t,
        on,
        hover: tokens.get(`pd.system.color.${name}.hover`),
        active: tokens.get(`pd.system.color.${name}.active`),
        subtle: tokens.get(`pd.system.color.${name}.subtle.$root`),
        onSubtle: tokens.get(`pd.system.color.on-${name}.subtle`),
        text: tokens.get(`pd.system.color.${name}.text.$root`),
        border: tokens.get(`pd.system.color.${name}.border.$root`),
        borderStrong: tokens.get(`pd.system.color.${name}.border.strong`)
      }
    })
    .filter((p): p is SemanticColorPair => p !== null)

  const pairFor = (name: string): SemanticColorPair | undefined =>
    pairs.find((p) => leafName(p.bg) === name)

  const headingId = pickTypo('heading', 'md') ?? pickTypo('heading', 'sm')
  const headingXsId = pickTypo('heading', 'xs')
  const bodySmId = pickTypo('body', 'sm')
  const labelId = pickTypo('label', 'sm') ?? pickTypo('label', 'md')
  const labelXsId = pickTypo('label', 'xs') ?? pickTypo('label', 'sm')
  const monoXsId = pickTypo('mono', 'xs') ?? pickTypo('mono', 'sm')
  const monoSmId = pickTypo('mono', 'sm')

  const bgBaseId = pick('pd.system.color.surface.base')
  const bgL1Id = pick('pd.system.color.surface.layer-1.$root')
  const bgL1SelectedId = pick('pd.system.color.surface.layer-1.selected.$root', 'pd.system.color.surface.layer-2.$root')
  const bgL2Id = pick('pd.system.color.surface.layer-2.$root')
  const bgElevId = pick('pd.system.color.surface.elevated')
  const bgHoverId = pick('pd.system.color.surface.layer-2.hover', 'pd.system.color.surface.hover')
  const bgSelectedId = pick('pd.system.color.surface.layer-2.selected.$root', 'pd.system.color.surface.selected.$root')
  const txtPrimaryId = pick('pd.system.color.on-surface.$root')

  const bgTokens = byType('color').filter((t) => t.path[1] === 'system' && t.path[2] === 'color' && t.path[3] === 'surface')
  const isInteractiveBg = (t: Token): boolean => {
    const tail = cleanPath(t).slice(4)
    return tail.some((seg) => seg === 'hover' || seg === 'active' || seg === 'selected')
  }
  const bgLayerTokens = bgTokens.filter((t) => !isInteractiveBg(t))
  const bgInteractiveTokens = bgTokens.filter((t) => isInteractiveBg(t))

  const textTokens = byType('color').filter((t) => t.path[1] === 'system' && t.path[2] === 'color' && t.path[3] === 'on-surface')
  const borderColorTokens = byType('color').filter((t) => t.path[1] === 'system' && t.path[2] === 'color' && t.path[3] === 'border')

  // Global raw palettes
  const rawColors = inFile('color').filter((t) => t.type === 'color' && !refOf(t.node.$value))
  const colorGroups = new Map<string, Token[]>()
  for (const t of rawColors) {
    const key = cleanPath(t).slice(0, -1).join('.')
    const bucket = colorGroups.get(key)
    if (bucket) {
      bucket.push(t)
    } else {
      colorGroups.set(key, [t])
    }
  }
  const palettes = [...colorGroups].filter(([, list]) => list.length >= 3)
  const singles = [...colorGroups].filter(([, list]) => list.length < 3).flatMap(([, list]) => list)

  // Typography scales
  const fontSizes = all.filter((t) => t.type === 'dimension' && t.id.includes('font.size') && !isSystem(t))
  const systemWeights = all.filter((t) => t.type === 'fontWeight' && isSystem(t))
  const weights = all.filter((t) => t.type === 'fontWeight' && !isSystem(t))

  // Spacing & Sizing
  const spacing = inFile('spacing').filter((t) => t.type === 'dimension')
  const sizing = inFile('sizing').filter((t) => t.type === 'dimension')
  const controlHeights = sizing.filter((t) => t.path.includes('control'))
  const iconSizes = sizing.filter((t) => t.path.includes('icon'))
  const systemSizes = sizing.filter((t) => isSystem(t) && !t.path.includes('control') && !t.path.includes('icon'))
  const globalSizes = sizing.filter((t) => !isSystem(t))

  // Border
  const borderTokens = inFile('border')
  const radii = borderTokens.filter((t) => t.path.includes('radius'))
  const focusTokens = borderTokens.filter((t) => t.path.includes('focus'))
  const widths = borderTokens.filter((t) => t.type === 'dimension' && t.path.includes('width') && !t.path.includes('focus'))
  const offsets = borderTokens.filter((t) => t.type === 'dimension' && t.path.includes('offset') && !t.path.includes('focus'))
  const styles = borderTokens.filter((t) => t.type === 'strokeStyle' && !t.path.includes('focus'))
  const focusColorCss = v('pd.system.color.border.focus.$root', '#3b63fb')
  const focusWidthCss = v('pd.system.border.focus.width', '2px')
  const focusStyleCss = v('pd.system.border.focus.style', 'solid')

  // Opacity
  const opacityTokens = inFile('opacity').filter((t) => t.type === 'number')
  const sysOpacity = opacityTokens.filter(isSystem)
  const globalOpacity = opacityTokens.filter((t) => !isSystem(t))

  // Elevation
  const shadows = byType('shadow')
  const zIndexTokens = inFile('elevation').filter((t) => t.type === 'number')
  const sysZIndex = zIndexTokens.filter(isSystem)
  const globalZIndex = zIndexTokens.filter((t) => !isSystem(t))
  const elevationDims = inFile('elevation').filter((t) => t.type === 'dimension')

  // Motion
  const motionTokens = inFile('motion')
  const durations = motionTokens.filter((t) => t.type === 'duration')
  const easings = motionTokens.filter((t) => t.type === 'cubicBezier')

  const renderBadge = (p: SemanticColorPair | undefined) => {
    if (!p) return null
    const name = leafName(p.bg)
    const bgCss = p.subtle ? v(p.subtle.id) : v(p.bg.id)
    const fgCss = p.onSubtle ? v(p.onSubtle.id) : v(p.on.id)
    const borderCss = p.border ? v(p.border.id) : 'transparent'
    const jumpId = p.subtle?.id ?? p.bg.id
    return (
      <span
        key={name}
        onClick={(e) => {
          e.stopPropagation()
          onJump(jumpId)
        }}
        title={jumpId}
        style={{
          ...fontStyle(labelXsId),
          background: bgCss,
          color: fgCss,
          borderColor: borderCss
        }}
        className="inline-flex items-center px-2xs py-3xs rounded-2xs border-sm cursor-pointer"
      >
        {name}
      </span>
    )
  }

  const renderAlert = (p: SemanticColorPair | undefined, title: string, text: string) => {
    if (!p) return null
    const bgCss = p.subtle ? v(p.subtle.id) : v(p.bg.id)
    const borderCss = p.border ? v(p.border.id) : 'transparent'
    const titleCss = p.onSubtle ? v(p.onSubtle.id) : v(p.bg.id)
    const jumpId = p.subtle?.id ?? p.bg.id

    return (
      <div
        key={title}
        onClick={() => onJump(jumpId)}
        title={jumpId}
        style={{
          background: bgCss,
          borderColor: borderCss
        }}
        className="flex items-start gap-xs px-sm py-xs rounded-xs border-sm cursor-pointer"
      >
        <span
          style={{
            background: v(p.bg.id),
            color: v(p.on.id)
          }}
          className="inline-flex items-center justify-center w-4 h-4 rounded-2xs text-label-xs font-bold shrink-0 mt-0.5"
        >
          !
        </span>
        <div className="flex flex-col gap-3xs">
          <strong style={{ ...fontStyle(labelId), color: titleCss }}>{title}</strong>
          <span className="text-body-sm text-on-surface">{text}</span>
        </div>
      </div>
    )
  }

  const sampleMenuItems: MenuItemData[] = [
    {
      type: 'group',
      label: 'Jump to Token',
      items: [
        { label: 'pd.system.color.primary', shortcut: 'Color', onClick: () => onJump('pd.system.color.primary.$root') },
        { label: 'pd.system.color.surface.elevated', shortcut: 'Surface', onClick: () => onJump('pd.system.color.surface.elevated') },
        { label: 'pd.system.elevation.lg', shortcut: 'Shadow', onClick: () => onJump('pd.system.elevation.lg') }
      ]
    },
    { type: 'separator' },
    {
      label: 'Inspect Danger Token',
      tone: 'danger',
      onClick: () => onJump('pd.system.color.danger.$root')
    }
  ]

  return (
    <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden bg-base">
      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center gap-sm px-md py-xs bg-layer-1 border-b border-border-default shrink-0">
        <TooltipTrigger>
          <Button
            variant="secondary"
            size="xs"
            onPress={onToggleSidebar}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? <RiSideBarLine /> : <RiSideBarFill />}
            {sidebarCollapsed ? '展開側欄' : '收合側欄'}
          </Button>
          <Tooltip>收合或展開左側編輯器 (⌘B / Ctrl+B)</Tooltip>
        </TooltipTrigger>

        <ToggleButtonGroup
          aria-label="預覽主題"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([theme])}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next === 'light' || next === 'dark') {
              onThemeChange(next)
            }
          }}
        >
          <ToggleButton id="light" size="xs" variant="primary">
            <RiSunLine />
            淺色主題 Light
          </ToggleButton>
          <ToggleButton id="dark" size="xs" variant="primary">
            <RiMoonLine />
            深色主題 Dark
          </ToggleButton>
        </ToggleButtonGroup>

        <span className="text-caption-md text-on-surface-muted">
          切換主題將同步預覽與左側 system.light / system.dark 編輯器（點擊預覽元素可跳轉至對應 token）
        </span>
      </div>

      {/* Preview Canvas */}
      <div
        data-canvas={theme}
        className="flex-1 min-h-0 overflow-y-auto p-md flex flex-col gap-lg"
      >
        {/* 1. UI Sample */}
        <PreviewSection
          id="ui"
          title="UI 範例"
          note="以 System token 與 React Aria 元件組合而成的互動範例（點擊區塊可定位左側 token）"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
            <div className="flex flex-col gap-sm p-md rounded-sm bg-layer-2 border-sm border-border-default shadow-elevation-xs">
              <div className="flex flex-col gap-3xs">
                <span
                  onClick={() => onJump(labelXsId)}
                  title={labelXsId}
                  className="text-label-xs text-on-surface-muted uppercase cursor-pointer w-fit"
                >
                  Workspace · Compact UI
                </span>
                <h3
                  onClick={() => onJump(headingId)}
                  title={headingId}
                  className="text-heading-md text-on-surface m-0 cursor-pointer w-fit"
                >
                  專案設定 Project Settings
                </h3>
                {headingXsId && (
                  <div
                    onClick={() => onJump(headingXsId)}
                    title={headingXsId}
                    className="text-heading-xs font-medium text-on-surface cursor-pointer w-fit"
                  >
                    高密度、緊湊且直截了當的介面配置
                  </div>
                )}
                <p
                  onClick={() => onJump(bodySmId)}
                  title={bodySmId}
                  className="text-body-sm text-on-surface-muted m-0 cursor-pointer"
                >
                  減少非必要的留白與視覺裝飾，專注於清晰的資訊階層與快速操作。
                </p>
              </div>

              <TextField
                size="md"
                label="電子郵件 Email"
                description="圖說與輔助標註 (Caption)：變更將即時套用至所有連線工作階段。"
                value={sampleEmail}
                onChange={setSampleEmail}
              />

              <div className="flex flex-col gap-xs pt-2xs border-t border-border-subtle">
                <Checkbox
                  checked={sampleCompact}
                  onCheckedChange={setSampleCompact}
                  label="啟用高密度緊湊模式 (Compact Density)"
                  description="使用 4px 基準網格與 28px–32px 控制項高度。"
                />
                <Checkbox
                  checked={sampleApca}
                  onCheckedChange={setSampleApca}
                  label="強制執行 APCA Lc 對比度檢測"
                  description="即時驗證淺色與深色主題下的字體與背景對比。"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2xs pt-2xs">
                <Button variant="primary" size="sm" onPress={() => onJump('pd.system.color.primary.$root')}>
                  Primary
                </Button>
                <Button variant="secondary" size="sm" onPress={() => onJump('pd.system.color.surface.layer-1.$root')}>
                  Secondary
                </Button>
                <Button variant="subtle" size="sm" onPress={() => onJump('pd.system.color.info.subtle')}>
                  Subtle
                </Button>
                <Button variant="danger" size="sm" onPress={() => onJump('pd.system.color.danger.$root')}>
                  Danger
                </Button>
                <Menu triggerLabel="更多操作" items={sampleMenuItems} />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex flex-col gap-xs p-md rounded-sm bg-layer-2 border-sm border-border-default shadow-elevation-xs">
                <h4
                  onClick={() => onJump(labelId)}
                  className="text-label-sm text-on-surface m-0 cursor-pointer"
                >
                  狀態提示 Alerts
                </h4>
                {renderAlert(pairFor('success'), '儲存成功', '設定變更已即時同步。')}
                {renderAlert(pairFor('warning'), '額度提醒', '儲存空間使用率已達 85%。')}
                {renderAlert(pairFor('danger'), '連線異常', '無法連線至遠端節點，請檢查網路狀態。')}
                {renderAlert(pairFor('info'), '快捷鍵', '按下 ⌘B 可快速收合左側編輯面板。')}
              </div>

              <div className="flex flex-col gap-xs p-md rounded-sm bg-layer-2 border-sm border-border-default shadow-elevation-xs">
                <h4
                  onClick={() => onJump(labelId)}
                  className="text-label-sm text-on-surface m-0 cursor-pointer"
                >
                  語意色按鈕與標籤 Semantic Roles & Badges
                </h4>
                <div className="flex flex-wrap gap-2xs">
                  {pairs.map((p) => {
                    const name = leafName(p.bg)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => onJump(p.bg.id)}
                        title={p.bg.id}
                        style={{
                          ...fontStyle(labelId),
                          background: v(p.bg.id),
                          color: v(p.on.id),
                          borderColor: v(p.bg.id)
                        }}
                        className="h-control-sm px-sm rounded-xs border-sm inline-flex items-center cursor-pointer"
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-2xs">
                  {pairs.map((p) => renderBadge(p))}
                </div>
              </div>
            </div>
          </div>
        </PreviewSection>

        {/* 2. Colours */}
        <PreviewSection id="color" title="色彩 Color">
          {bgTokens.length > 0 && (
            <div className="flex flex-col gap-sm">
              <h3 className="text-label-md text-on-surface m-0">
                System · 背景與容器階層（Compact Multi-Pane Workspace 多欄高密度工作區）
              </h3>
              <div className="rounded-sm border-sm border-border-default shadow-elevation-xs overflow-hidden flex flex-col">
                {/* TopNav */}
                <header
                  onClick={() => onJump(bgL1Id)}
                  title={bgL1Id}
                  className="flex items-center justify-between gap-sm px-sm py-xs bg-layer-1 border-b border-border-default cursor-pointer"
                >
                  <div className="flex items-center gap-xs">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-2xs bg-primary text-on-primary text-label-xs font-bold">
                      P
                    </span>
                    <strong className="text-label-sm text-on-surface">TopNav</strong>
                    <nav className="flex items-center gap-sm text-body-sm text-on-surface-muted">
                      <span>檔案 File</span>
                      <span>編輯 Edit</span>
                      <span>檢視 View</span>
                      <span>視窗 Window</span>
                    </nav>
                  </div>
                  <code className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-2 text-on-surface-muted border-sm border-border-subtle">
                    background.layer-1 ({formatValue('color', val(bgL1Id))})
                  </code>
                </header>

                <div className="flex min-h-60">
                  {/* Left Side-Nav */}
                  <aside
                    onClick={() => onJump(bgL1Id)}
                    title={bgL1Id}
                    className="w-44 shrink-0 bg-layer-1 p-xs border-r border-border-default flex flex-col gap-2xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-label-xs text-on-surface-muted">Side-Nav</span>
                      <code className="text-mono-xs text-on-surface-muted">layer-1</code>
                    </div>
                    <div className="flex flex-col gap-3xs mt-3xs">
                      {['▤ 總覽 Overview', '☰ 資料表 Records', '⛁ 儲存體 Storage', '⚙ 系統設定 Settings'].map((tool, i) => (
                        <div
                          key={tool}
                          style={
                            i === 0
                              ? { background: v(bgL1SelectedId), color: v('pd.system.color.on-surface.$root') }
                              : undefined
                          }
                          className={`px-xs py-3xs rounded-2xs text-body-sm ${i === 0 ? 'font-medium' : 'text-on-surface-muted'}`}
                        >
                          {tool}
                        </div>
                      ))}
                    </div>
                  </aside>

                  {/* Base Canvas */}
                  <main
                    onClick={() => onJump(bgBaseId)}
                    title={bgBaseId}
                    className="flex-1 bg-base p-md flex flex-col gap-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-xs">
                      <strong className="text-label-xs text-on-surface-muted">
                        底層畫布 Workspace Base（結構分隔底層，不直接放置操作元素）
                      </strong>
                      <code className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-1 text-on-surface-muted border-sm border-border-subtle">
                        background.base ({formatValue('color', val(bgBaseId))})
                      </code>
                    </div>

                    {/* Layer 2 Content Panel */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        onJump(bgL2Id)
                      }}
                      title={bgL2Id}
                      className="bg-layer-2 rounded-xs border-sm border-border-default p-md flex flex-col gap-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between pb-2xs border-b border-border-default">
                        <div>
                          <strong className="text-label-sm text-on-surface">
                            主要內容面板 Primary Content Panel
                          </strong>
                          <div className="text-caption-md text-on-surface-muted">
                            放置於 background.base 之上，採用最清晰的 background.layer-2 承載密集資訊。
                          </div>
                        </div>
                        <code className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-1 text-on-surface-muted border-sm border-border-subtle">
                          background.layer-2 ({formatValue('color', val(bgL2Id))})
                        </code>
                      </div>

                      {/* Elevated Floating HUD */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onJump(bgElevId)
                        }}
                        title={bgElevId}
                        className="bg-elevated shadow-elevation-md border-sm border-border-default rounded-xs p-sm flex flex-col gap-2xs cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-xs">
                          <strong className="text-label-sm text-on-surface">
                            浮動操作面板 Contextual Popover
                          </strong>
                          <code className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-1 text-on-surface-muted border-sm border-border-subtle">
                            background.elevated + elevation.md
                          </code>
                        </div>
                        <div className="text-caption-md text-on-surface-muted">
                          與 <code>layer-2</code> 亮度相同（{formatValue('color', val(bgElevId))}），透過陰影與邊框拉開層次。
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>

              {/* Background Layer Swatches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
                {bgLayerTokens.map((t) => {
                  const last = leafName(t)
                  const isElevated = last.includes('elevated')
                  const isBackdrop = last === 'backdrop'
                  const fg = readableOn(val(t.id))
                  return (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      style={{
                        background: v(t.id),
                        color: fg
                      }}
                      className={`flex flex-col gap-3xs p-sm rounded-xs border-sm border-border-default cursor-pointer ${isElevated ? 'shadow-elevation-md' : ''}`}
                    >
                      <strong className="text-label-sm">{displayPath(t)}</strong>
                      <span className="text-mono-xs opacity-85">
                        {formatValue('color', val(t.id))} → {refOf(t.node.$value) ?? '自訂值'}
                      </span>
                      {isElevated && (
                        <span className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-1 text-on-surface border-sm border-border-subtle w-fit">
                          + pd.system.elevation.md
                        </span>
                      )}
                      {isBackdrop && (
                        <span className="text-mono-xs px-2xs py-3xs rounded-2xs bg-layer-1 text-on-surface border-sm border-border-subtle w-fit">
                          Modal / Drawer Scrim
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Interactive Surface States */}
              {bgInteractiveTokens.length > 0 && (
                <div className="flex flex-col gap-xs pt-xs">
                  <h3 className="text-label-md text-on-surface m-0">
                    System · 互動表面狀態（Interactive Surface States · 高密度資料表格與清單列）
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
                    {bgInteractiveTokens.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onJump(t.id)}
                        title={t.id}
                        style={{ background: v(t.id) }}
                        className="flex flex-col gap-3xs p-sm rounded-xs border-sm border-border-default text-on-surface cursor-pointer"
                      >
                        <strong className="text-label-sm">{displayPath(t)}</strong>
                        <span className="text-mono-xs text-on-surface-muted">
                          {formatValue('color', val(t.id))} → {refOf(t.node.$value) ?? '自訂值'}
                        </span>
                        {txtPrimaryId && (
                          <ContrastBadge txtVal={val(txtPrimaryId)} bgVal={val(t.id)} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Interactive Table Demo */}
                  <div className="rounded-xs border-sm border-border-default bg-layer-2 overflow-hidden">
                    <div className="grid grid-cols-[8rem_1fr_8rem_6rem_8rem] items-center gap-sm px-sm py-2xs bg-layer-1 border-b border-border-default text-label-xs text-on-surface-muted">
                      <span>識別碼 (mono.xs)</span>
                      <span>項目名稱 Item Name（Hover / 點按檢視狀態）</span>
                      <span className="text-right">數值 (.tabular-nums)</span>
                      <span>狀態 Status</span>
                      <span>表面 Token</span>
                    </div>
                    <div
                      onClick={() => onJump(bgHoverId)}
                      className="grid grid-cols-[8rem_1fr_8rem_6rem_8rem] items-center gap-sm px-sm py-2xs border-b border-border-subtle bg-layer-2 hover:bg-layer-2-hover active:bg-layer-2-active text-body-sm text-on-surface cursor-pointer"
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          onJump(monoXsId)
                        }}
                        className="text-mono-xs"
                      >
                        ID-8042-A
                      </span>
                      <span>Core API Gateway</span>
                      <span className="tabular-nums text-right">12.05 ms</span>
                      <span>{renderBadge(pairFor('success'))}</span>
                      <code className="text-mono-xs text-on-surface-muted">layer-2 → hover</code>
                    </div>
                    <div
                      onClick={() => onJump(bgSelectedId)}
                      className="grid grid-cols-[8rem_1fr_8rem_6rem_8rem] items-center gap-sm px-sm py-2xs border-b border-border-subtle bg-layer-2-selected hover:bg-layer-2-selected-hover text-body-sm text-on-surface cursor-pointer"
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          onJump(monoXsId)
                        }}
                        className="text-mono-xs"
                      >
                        ID-8049-B
                      </span>
                      <strong>✦ 已選取項目：Auth Token Service</strong>
                      <span className="tabular-nums text-right">108.40 ms</span>
                      <span>{renderBadge(pairFor('primary'))}</span>
                      <code className="text-mono-xs text-on-surface-muted">selected → hover</code>
                    </div>
                    <div
                      onClick={() => onJump(bgHoverId)}
                      className="grid grid-cols-[8rem_1fr_8rem_6rem_8rem] items-center gap-sm px-sm py-2xs bg-layer-2 hover:bg-layer-2-hover active:bg-layer-2-active text-body-sm text-on-surface cursor-pointer"
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          onJump(monoXsId)
                        }}
                        className="text-mono-xs"
                      >
                        ID-8053-C
                      </span>
                      <span>Batch Sync Worker</span>
                      <span className="tabular-nums text-right">9.10 ms</span>
                      <span>{renderBadge(pairFor('warning'))}</span>
                      <code className="text-mono-xs text-on-surface-muted">layer-2 → hover</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text & Border Semantic Colors */}
          {(textTokens.length > 0 || borderColorTokens.length > 0) && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 文字與邊框語意色（Text & Border on Layer-2 · APCA Lc 對比）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
                {textTokens.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    style={{ color: v(t.id) }}
                    className="flex flex-col gap-3xs p-sm rounded-xs bg-layer-2 border-sm border-border-default cursor-pointer"
                  >
                    <strong className="text-label-sm">{displayPath(t)}</strong>
                    <span className="text-mono-xs opacity-85">
                      {formatValue('color', val(t.id))} → {refOf(t.node.$value) ?? '自訂值'}
                    </span>
                    {bgL2Id && <ContrastBadge txtVal={val(t.id)} bgVal={val(bgL2Id)} />}
                  </div>
                ))}
                {borderColorTokens.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    style={{ borderColor: v(t.id), borderWidth: '2px' }}
                    className="flex flex-col gap-3xs p-sm rounded-xs bg-layer-2 border-solid text-on-surface cursor-pointer"
                  >
                    <strong className="text-label-sm">{displayPath(t)}</strong>
                    <span className="text-mono-xs text-on-surface-muted">
                      {formatValue('color', val(t.id))} → {refOf(t.node.$value) ?? '自訂值'}
                    </span>
                    {bgL2Id && <ContrastBadge txtVal={val(t.id)} bgVal={val(bgL2Id)} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solid Semantic Roles */}
          {pairs.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 實心語意與互動狀態（Solid Semantic Roles · Hover / Active）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xs">
                {pairs.map(({ bg, on, hover, active }) => (
                  <div
                    key={bg.id}
                    onClick={() => onJump(bg.id)}
                    title={bg.id}
                    style={{
                      background: v(bg.id),
                      color: v(on.id)
                    }}
                    className="flex flex-col gap-2xs p-sm rounded-xs border-sm border-border-default cursor-pointer"
                  >
                    <strong className="text-label-md">{leafName(bg)}</strong>
                    <span className="text-mono-xs opacity-90">
                      {formatValue('color', val(bg.id))} → {refOf(bg.node.$value) ?? '自訂值'}
                    </span>
                    <span className="text-mono-xs opacity-90">
                      on-{leafName(bg)} → {refOf(on.node.$value) ?? formatValue('color', val(on.id))}
                    </span>
                    {(hover || active) && (
                      <div className="flex gap-2xs pt-3xs">
                        {hover && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              onJump(hover.id)
                            }}
                            style={{ background: v(hover.id), color: v(on.id) }}
                            className="px-2xs py-3xs rounded-2xs text-mono-xs border-sm border-white/20"
                          >
                            hover · {(refOf(hover.node.$value) ?? '').split('.').at(-1)}
                          </span>
                        )}
                        {active && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              onJump(active.id)
                            }}
                            style={{ background: v(active.id), color: v(on.id) }}
                            className="px-2xs py-3xs rounded-2xs text-mono-xs border-sm border-white/20"
                          >
                            active · {(refOf(active.node.$value) ?? '').split('.').at(-1)}
                          </span>
                        )}
                      </div>
                    )}
                    <ContrastBadge txtVal={val(on.id)} bgVal={val(bg.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtle Status Containers */}
          {pairs.some((p) => p.subtle && p.onSubtle) && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 柔和狀態容器與同色系標籤（Subtle Status Containers · X-subtle / on-X-subtle / X-border）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xs">
                {pairs
                  .filter((p): p is SemanticColorPair & { subtle: Token; onSubtle: Token } => Boolean(p.subtle && p.onSubtle))
                  .map(({ bg, subtle, onSubtle, border }) => {
                    const name = leafName(bg)
                    return (
                      <div
                        key={subtle.id}
                        onClick={() => onJump(subtle.id)}
                        title={subtle.id}
                        style={{
                          background: v(subtle.id),
                          color: v(onSubtle.id),
                          borderColor: border ? v(border.id) : 'transparent',
                          borderWidth: '2px'
                        }}
                        className="flex flex-col gap-3xs p-sm rounded-xs border-solid cursor-pointer"
                      >
                        <strong className="text-label-md">{name}-subtle</strong>
                        <span className="text-mono-xs">
                          bg → {refOf(subtle.node.$value) ?? formatValue('color', val(subtle.id))}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            onJump(onSubtle.id)
                          }}
                          className="text-mono-xs underline decoration-dotted"
                        >
                          text → {refOf(onSubtle.node.$value) ?? formatValue('color', val(onSubtle.id))}
                        </span>
                        {border && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              onJump(border.id)
                            }}
                            className="text-mono-xs underline decoration-dotted"
                          >
                            border → {refOf(border.node.$value) ?? formatValue('color', val(border.id))}
                          </span>
                        )}
                        <ContrastBadge txtVal={val(onSubtle.id)} bgVal={val(subtle.id)} />
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Semantic Foreground Text & Strong Borders */}
          {pairs.some((p) => p.text) && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 語意前景文字與強調邊框（Semantic Text / Icons & Border Strong on Layer-1）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
                {pairs
                  .filter((p): p is SemanticColorPair & { text: Token } => Boolean(p.text))
                  .map(({ bg, text, borderStrong }) => {
                    const name = leafName(bg)
                    return (
                      <div
                        key={text.id}
                        onClick={() => onJump(text.id)}
                        title={text.id}
                        style={{
                          borderColor: borderStrong ? v(borderStrong.id) : undefined,
                          borderWidth: '2px'
                        }}
                        className="flex flex-col gap-3xs p-sm rounded-xs bg-layer-1 border-solid cursor-pointer"
                      >
                        <strong style={{ color: v(text.id) }} className="text-label-md">
                          {name}.text · Link &amp; Checkmark
                        </strong>
                        <span className="text-mono-xs text-on-surface-muted">
                          text → {refOf(text.node.$value) ?? formatValue('color', val(text.id))}
                        </span>
                        {borderStrong && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              onJump(borderStrong.id)
                            }}
                            className="text-mono-xs text-on-surface-muted underline decoration-dotted"
                          >
                            border.strong → {refOf(borderStrong.node.$value) ?? formatValue('color', val(borderStrong.id))}
                          </span>
                        )}
                        {bgL1Id && <ContrastBadge txtVal={val(text.id)} bgVal={val(bgL1Id)} />}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Global Palettes */}
          <div className="flex flex-col gap-xs pt-xs">
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <h3 className="text-label-md text-on-surface m-0">
                Global · 色票（點擊跳轉左側 OKLCH 調色盤）
              </h3>
              <div className="flex items-center gap-xs">
                <span className="text-caption-md text-on-surface-muted">色票對比文字：</span>
                <ToggleButtonGroup
                  aria-label="色票對比文字顯示"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={new Set([swatchContrastMode])}
                  onSelectionChange={(keys) => {
                    const next = [...keys][0]
                    if (next === 'lc-white' || next === 'lc-black' || next === 'wcag-white' || next === 'none') {
                      onSwatchContrastChange(next)
                    }
                  }}
                >
                  {CONTRAST_MODES.map(([mode, text]) => (
                    <ToggleButton key={mode} id={mode} size="xs" variant="primary">
                      {text}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
            </div>

            <div className="flex flex-col gap-2xs">
              {palettes.map(([key, list]) => (
                <div key={key} className="grid grid-cols-[6rem_1fr] items-center gap-xs">
                  <code className="text-mono-xs text-on-surface-secondary truncate">
                    {key.split('.').at(-1)}
                  </code>
                  <div className="grid grid-cols-12 gap-3xs">
                    {list.map((t) => {
                      const value = val(t.id)
                      const lcWhite = Math.abs(apcaContrast(value, '#ffffff'))
                      const lcBlack = Math.abs(apcaContrast(value, '#000000'))
                      const ratio = contrast(value, '#ffffff')
                      const contrastLabel =
                        swatchContrastMode === 'lc-white'
                          ? `Lc ${lcWhite.toFixed(0)}`
                          : swatchContrastMode === 'lc-black'
                            ? `Lc ${lcBlack.toFixed(0)}`
                            : swatchContrastMode === 'wcag-white'
                              ? `${ratio.toFixed(2)}:1`
                              : null

                      return (
                        <div
                          key={t.id}
                          onClick={() => onJump(t.id)}
                          title={`${t.id} · vs #fff: Lc ${lcWhite.toFixed(1)} (${ratio.toFixed(2)}:1) · vs #000: Lc ${lcBlack.toFixed(1)}`}
                          style={{
                            background: v(t.id),
                            color: readableOn(value)
                          }}
                          className="flex flex-col p-2xs rounded-2xs border-sm border-border-subtle cursor-pointer hover:scale-105 transition-transform text-mono-xs leading-tight"
                        >
                          <b>{t.path.at(-1)}</b>
                          <span className="opacity-85 truncate">{colorValueToHex(value)}</span>
                          {contrastLabel && <span className="opacity-75">{contrastLabel}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {singles.length > 0 && (
                <div className="grid grid-cols-[6rem_1fr] items-center gap-xs">
                  <code className="text-mono-xs text-on-surface-secondary">other</code>
                  <div className="flex flex-wrap gap-2xs">
                    {singles.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onJump(t.id)}
                        title={t.id}
                        style={{
                          background: v(t.id),
                          color: readableOn(val(t.id))
                        }}
                        className="flex flex-col px-xs py-2xs rounded-2xs border-sm border-border-default cursor-pointer text-mono-xs"
                      >
                        <b>{displayPath(t)}</b>
                        <span>{formatValue('color', val(t.id))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PreviewSection>

        {/* 3. Typography */}
        <PreviewSection id="typography" title="字體 Typography">
          <h3 className="text-label-md text-on-surface m-0">System · 複合字體樣式</h3>
          <div className="flex flex-col gap-xs">
            {typos.map((t) => {
              const isMono = t.path.includes('mono')
              const sample = isMono
                ? 'ID-2026-0048 · v2.1.0 · 0O1lI · 12.05 ms'
                : '設計系統讓產品保持一致 The quick brown fox jumps over the lazy dog'
              return (
                <div
                  key={t.id}
                  onClick={() => onJump(t.id)}
                  title={t.id}
                  className="flex flex-col gap-3xs p-sm rounded-xs bg-layer-2 border-sm border-border-subtle hover:border-border-strong cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-sm">
                    <code className="text-mono-xs text-primary">{displayPath(t)}</code>
                    <span className="text-mono-xs text-on-surface-muted">
                      {formatValue('typography', val(t.id) ?? {})}
                    </span>
                  </div>
                  <div style={fontStyle(t.id)} className="text-on-surface truncate">
                    {sample}
                  </div>
                </div>
              )
            })}
          </div>

          <h3 className="text-label-md text-on-surface m-0 pt-xs">
            等寬字體與對齊數字排版對照（pd.system.font.mono vs .tabular-nums）
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xs">
            <div
              onClick={() => onJump(monoSmId)}
              className="flex flex-col gap-xs p-sm rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
            >
              <h4 className="text-label-xs text-on-surface m-0">
                1. 等寬字體 <code>pd.system.font.mono.sm</code>
              </h4>
              <div style={fontStyle(monoSmId)} className="flex flex-col text-on-surface">
                <span>ID-2026-0011 · v1.0.4</span>
                <span>ID-2026-8840 · v12.8.0</span>
                <span>SHA-256: 0O1lI-9f4e2c8a</span>
              </div>
            </div>
            <div
              onClick={() => onJump(bodySmId)}
              className="flex flex-col gap-xs p-sm rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
            >
              <h4 className="text-label-xs text-on-surface m-0">
                2. 無襯線 + <code>.tabular-nums</code>（垂直對齊）
              </h4>
              <div style={fontStyle(bodySmId)} className="flex flex-col tabular-nums text-on-surface">
                <span>11,111.10 · 12.05 ms (99.1%)</span>
                <span>88,888.85 · 98.40 ms (84.5%)</span>
                <span>20,409.00 · 10.00 ms (100.0%)</span>
              </div>
            </div>
            <div
              onClick={() => onJump(bodySmId)}
              className="flex flex-col gap-xs p-sm rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
            >
              <h4 className="text-label-xs text-on-surface m-0">
                3. 一般比例數字（未加 <code>.tabular-nums</code>）
              </h4>
              <div style={fontStyle(bodySmId)} className="flex flex-col text-on-surface-muted">
                <span>11,111.10 · 12.05 ms (99.1%)</span>
                <span>88,888.85 · 98.40 ms (84.5%)</span>
                <span>20,409.00 · 10.00 ms (100.0%)</span>
              </div>
            </div>
          </div>

          {fontSizes.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">Global · 字級尺度</h3>
              <div className="flex flex-wrap items-baseline gap-md p-sm rounded-xs bg-layer-2 border-sm border-border-subtle">
                {fontSizes.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    className="flex flex-col items-start gap-3xs cursor-pointer"
                  >
                    <span style={{ fontSize: v(t.id), lineHeight: 1.1 }} className="text-on-surface">
                      Aa 字
                    </span>
                    <code className="text-mono-xs text-on-surface-muted">
                      {t.path.at(-1)} · {formatValue('dimension', val(t.id))}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {systemWeights.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">System · 語意字重</h3>
              <div className="flex flex-wrap gap-lg p-sm rounded-xs bg-layer-2 border-sm border-border-subtle">
                {systemWeights.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    className="flex flex-col items-start gap-3xs cursor-pointer"
                  >
                    <span style={{ fontWeight: v(t.id), fontSize: '28px' }} className="text-on-surface">
                      Ag 永
                    </span>
                    <code className="text-mono-xs text-on-surface-muted">
                      {t.path.at(-1)} · {String(val(t.id) ?? '')}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weights.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">Global · 字重</h3>
              <div className="flex flex-wrap gap-lg p-sm rounded-xs bg-layer-2 border-sm border-border-subtle">
                {weights.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    className="flex flex-col items-start gap-3xs cursor-pointer"
                  >
                    <span style={{ fontWeight: v(t.id), fontSize: '28px' }} className="text-on-surface">
                      Ag 永
                    </span>
                    <code className="text-mono-xs text-on-surface-muted">
                      {t.path.at(-1)} · {String(val(t.id) ?? '')}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PreviewSection>

        {/* 4. Spacing */}
        <PreviewSection id="spacing" title="間距 Spacing">
          {has('pd.system.spacing.md') && (
            <div className="flex flex-wrap gap-md">
              {['xs', 'sm', 'md', 'lg', 'xl'].filter((s) => has(`pd.system.spacing.${s}`)).map((s) => {
                const id = `pd.system.spacing.${s}`
                return (
                  <div
                    key={id}
                    onClick={() => onJump(id)}
                    title={id}
                    className="flex flex-col items-center gap-2xs cursor-pointer"
                  >
                    <div
                      style={{ padding: v(id) }}
                      className="bg-info-subtle border-sm border-dashed border-info-border rounded-xs"
                    >
                      <div className="w-10 h-10 bg-primary rounded-2xs" />
                    </div>
                    <code className="text-mono-xs text-on-surface-muted">padding: {s}</code>
                  </div>
                )
              })}
            </div>
          )}

          <h3 className="text-label-md text-on-surface m-0 pt-xs">System</h3>
          <div className="flex flex-col gap-2xs">
            {spacing.filter(isSystem).map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="grid grid-cols-[10rem_1fr_6rem] items-center gap-sm px-sm py-2xs rounded-2xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
              >
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <div className="h-3 rounded-2xs bg-primary" style={{ width: v(t.id) }} />
                <span className="text-mono-xs text-on-surface-muted text-right">
                  {formatValue(t.type, val(t.id))}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-label-md text-on-surface m-0 pt-xs">Global</h3>
          <div className="flex flex-col gap-2xs">
            {spacing.filter((t) => !isSystem(t)).map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="grid grid-cols-[10rem_1fr_6rem] items-center gap-sm px-sm py-2xs rounded-2xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
              >
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <div className="h-3 rounded-2xs bg-primary" style={{ width: v(t.id) }} />
                <span className="text-mono-xs text-on-surface-muted text-right">
                  {formatValue(t.type, val(t.id))}
                </span>
              </div>
            ))}
          </div>
        </PreviewSection>

        {/* 5. Sizing */}
        <PreviewSection id="sizing" title="尺寸 Sizing">
          {controlHeights.length > 0 && (
            <div className="flex flex-col gap-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 控制項與列高密度階層（pd.system.size.control.*）
              </h3>
              <div className="flex flex-col gap-xs">
                {controlHeights.map((t) => {
                  const key = t.path.at(-1) ?? ''
                  return (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      className="flex flex-wrap items-center gap-sm cursor-pointer"
                    >
                      <div
                        style={{ height: v(t.id) }}
                        className="px-sm rounded-xs border-sm border-border-default bg-layer-2 inline-flex items-center gap-xs text-body-sm text-on-surface"
                      >
                        <span className="text-mono-xs text-primary">{key}</span>
                        <span>{DENSITY_LABELS[key] ?? key}</span>
                      </div>
                      <code className="text-mono-xs text-on-surface-muted">
                        {displayPath(t)} · {formatValue('dimension', val(t.id))}
                      </code>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {iconSizes.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 圖示尺寸語意階層（pd.system.size.icon.*）
              </h3>
              <div className="flex flex-col gap-xs">
                {iconSizes.map((t) => {
                  const key = t.path.at(-1) ?? ''
                  return (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      className="flex flex-wrap items-center gap-sm cursor-pointer"
                    >
                      <div className="px-xs py-2xs rounded-xs border-sm border-border-default bg-layer-2 inline-flex items-center justify-center text-on-surface">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: v(t.id), height: v(t.id) }}
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      </div>
                      <code className="text-mono-xs text-on-surface">
                        {displayPath(t)} · {formatValue('dimension', val(t.id))}
                      </code>
                      <span className="text-body-sm text-on-surface-muted">
                        {ICON_ROLE_LABELS[key] ?? ''}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <h3 className="text-label-md text-on-surface m-0 pt-xs">System · 基礎尺寸（pd.system.size.*）</h3>
          <div className="flex flex-wrap items-end gap-md">
            {systemSizes.map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="flex flex-col items-center gap-3xs cursor-pointer"
              >
                <div
                  style={{ width: v(t.id), height: v(t.id) }}
                  className="bg-primary/20 border-sm border-primary rounded-2xs"
                />
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <span className="text-mono-xs text-on-surface-muted">
                  {formatValue('dimension', val(t.id))}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-label-md text-on-surface m-0 pt-xs">Global</h3>
          <div className="flex flex-wrap items-end gap-md">
            {globalSizes.map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="flex flex-col items-center gap-3xs cursor-pointer"
              >
                <div
                  style={{ width: v(t.id), height: v(t.id) }}
                  className="bg-primary/20 border-sm border-primary rounded-2xs"
                />
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <span className="text-mono-xs text-on-surface-muted">
                  {formatValue('dimension', val(t.id))}
                </span>
              </div>
            ))}
          </div>
        </PreviewSection>

        {/* 6. Border */}
        <PreviewSection id="border" title="邊框 Border">
          {focusTokens.length > 0 && (
            <div className="flex flex-col gap-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 無障礙焦點環幾何規範（pd.system.border.focus.* + pd.system.color.border.focus）
              </h3>
              <div className="flex flex-wrap gap-md">
                {([
                  ['pd.system.border.focus.offset.$root', 'offset (+2px)', '獨立按鈕與控制項外擴焦點環', '2px'],
                  ['pd.system.border.focus.offset.flush', 'offset.flush (0px)', '輸入框與停靠面板貼齊焦點環', '0px'],
                  ['pd.system.border.focus.offset.inset', 'offset.inset (-2px)', '高密度表格儲存格與清單內縮焦點環（防裁切）', '-2px']
                ] as const).map(([id, label, desc, fb]) => (
                  <div
                    key={id}
                    onClick={() => onJump(id)}
                    title={id}
                    style={{
                      outline: `${focusWidthCss} ${focusStyleCss} ${focusColorCss}`,
                      outlineOffset: v(id, fb)
                    }}
                    className="px-md py-xs rounded-sm bg-layer-2 border-sm border-border-default text-body-sm text-on-surface cursor-pointer"
                  >
                    <strong>{label}</strong> · {desc}
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-label-md text-on-surface m-0 pt-xs">Border Radius</h3>
          <div className="flex flex-wrap gap-md">
            {radii.map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="flex flex-col items-center gap-3xs cursor-pointer"
              >
                <div
                  style={{ borderRadius: v(t.id) }}
                  className="w-16 h-16 bg-layer-2 border-md border-primary"
                />
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <span className="text-mono-xs text-on-surface-muted">
                  {formatValue('dimension', val(t.id))}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-label-md text-on-surface m-0 pt-xs">Border Width</h3>
          <div className="flex flex-wrap gap-md">
            {widths.map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="flex flex-col items-center gap-3xs cursor-pointer"
              >
                <div
                  style={{ borderWidth: v(t.id) }}
                  className="w-16 h-16 rounded-xs bg-layer-2 border-solid border-primary"
                />
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                <span className="text-mono-xs text-on-surface-muted">
                  {formatValue('dimension', val(t.id))}
                </span>
              </div>
            ))}
          </div>

          {offsets.length > 0 && (
            <>
              <h3 className="text-label-md text-on-surface m-0 pt-xs">Global · Outline Offset</h3>
              <div className="flex flex-wrap gap-md">
                {offsets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    className="flex flex-col items-center gap-3xs cursor-pointer"
                  >
                    <div
                      style={{
                        outline: `2px solid ${focusColorCss}`,
                        outlineOffset: v(t.id)
                      }}
                      className="w-16 h-16 rounded-xs bg-layer-2 border-sm border-border-default"
                    />
                    <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                    <span className="text-mono-xs text-on-surface-muted">
                      {formatValue('dimension', val(t.id))}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="text-label-md text-on-surface m-0 pt-xs">Border Style</h3>
          <div className="flex flex-wrap gap-md">
            {styles.map((t) => (
              <div
                key={t.id}
                onClick={() => onJump(t.id)}
                title={t.id}
                className="flex flex-col items-center gap-3xs cursor-pointer"
              >
                <div
                  style={{ borderStyle: v(t.id), borderWidth: '3px' }}
                  className="w-16 h-16 rounded-xs bg-layer-2 border-primary"
                />
                <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
              </div>
            ))}
          </div>
        </PreviewSection>

        {/* 7. Elevation & Z-Index */}
        <PreviewSection id="elevation" title="陰影與圖層 Elevation & Z-Index">
          {shadows.length > 0 && (
            <div className="flex flex-col gap-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 複合陰影樣式（亮暗模式自適應陰影深度）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md p-xs">
                {shadows.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    style={{ boxShadow: v(t.id) }}
                    className="flex flex-col gap-2xs p-md rounded-md bg-layer-2 border-sm border-border-subtle cursor-pointer"
                  >
                    <strong className="text-label-md text-on-surface">{cleanPath(t).slice(3).join('.')}</strong>
                    <code className="text-mono-xs text-on-surface-muted whitespace-pre-wrap">
                      {formatValue('shadow', val(t.id) ?? {}).replaceAll(' · ', '\n')}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sysZIndex.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">
                System · 圖層堆疊階層（pd.system.elevation.z.*）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
                {sysZIndex.map((t) => {
                  const key = t.path.at(-1) ?? ''
                  return (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      className="flex flex-col gap-3xs p-sm rounded-xs bg-layer-2 border-sm border-border-default cursor-pointer"
                    >
                      <strong className="text-label-sm text-on-surface">
                        z-index.{key} · {String(val(t.id) ?? '')}
                      </strong>
                      <span className="text-caption-md text-on-surface-secondary">
                        {Z_ROLES[key] ?? ''}
                      </span>
                      <code className="text-mono-xs text-on-surface-muted">
                        ← {refOf(t.node.$value) ?? '自訂值'}
                      </code>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {globalZIndex.length > 0 && (
            <div className="flex flex-col gap-xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">Global · Z-Index 原始尺度</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-xs">
                {globalZIndex.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onJump(t.id)}
                    title={t.id}
                    className="flex flex-col gap-3xs p-xs rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
                  >
                    <strong className="text-label-xs text-on-surface">
                      {displayPath(t)}
                    </strong>
                    <span className="text-mono-xs text-on-surface-muted">
                      z-index: {String(val(t.id) ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {elevationDims.length > 0 && (
            <div className="flex flex-col gap-2xs pt-xs">
              <h3 className="text-label-md text-on-surface m-0">Global · Offset / Blur / Spread</h3>
              {elevationDims.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onJump(t.id)}
                  title={t.id}
                  className="grid grid-cols-[10rem_1fr_6rem] items-center gap-sm px-sm py-2xs rounded-2xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
                >
                  <code className="text-mono-xs text-on-surface">{displayPath(t)}</code>
                  <div className="h-3 rounded-2xs bg-primary" style={{ width: v(t.id) }} />
                  <span className="text-mono-xs text-on-surface-muted text-right">
                    {formatValue(t.type, val(t.id))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PreviewSection>

        {/* 8. Motion */}
        {motionTokens.length > 0 && (
          <PreviewSection
            id="motion"
            title="動態 Motion"
            note="將滑鼠移至軌道上方即可即時預覽各個 Duration 與 Cubic-Bezier 曲線的動態表現"
          >
            <h3 className="text-label-md text-on-surface m-0">
              System · 轉場時間（Hover 檢視真實動畫速度）
            </h3>
            <div className="flex flex-col gap-2xs" style={{ containerType: 'inline-size' }}>
              {durations.filter(isSystem).map((t) => (
                <MotionRow
                  key={t.id}
                  token={t}
                  resolvedVal={val(t.id)}
                  isDuration
                  onJump={onJump}
                />
              ))}
            </div>

            <h3 className="text-label-md text-on-surface m-0 pt-xs">
              System · 緩動曲線（Hover 比較加速與減速曲線）
            </h3>
            <div className="flex flex-col gap-2xs" style={{ containerType: 'inline-size' }}>
              {easings.filter(isSystem).map((t) => (
                <MotionRow
                  key={t.id}
                  token={t}
                  resolvedVal={val(t.id)}
                  isDuration={false}
                  onJump={onJump}
                />
              ))}
            </div>

            <h3 className="text-label-md text-on-surface m-0 pt-xs">
              Global · Duration & Easing 原始尺度
            </h3>
            <div className="flex flex-col gap-2xs" style={{ containerType: 'inline-size' }}>
              {durations.filter((t) => !isSystem(t)).map((t) => (
                <MotionRow
                  key={t.id}
                  token={t}
                  resolvedVal={val(t.id)}
                  isDuration
                  onJump={onJump}
                />
              ))}
              {easings.filter((t) => !isSystem(t)).map((t) => (
                <MotionRow
                  key={t.id}
                  token={t}
                  resolvedVal={val(t.id)}
                  isDuration={false}
                  onJump={onJump}
                />
              ))}
            </div>
          </PreviewSection>
        )}
        {/* 9. Opacity */}
        {opacityTokens.length > 0 && (
          <PreviewSection id="opacity" title="透明度 Opacity">
            {sysOpacity.length > 0 && (
              <div className="flex flex-col gap-xs">
                <h3 className="text-label-md text-on-surface m-0">
                  System · 語意透明度（pd.system.opacity.*）
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-xs">
                  {sysOpacity.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      className="flex flex-col gap-2xs p-sm rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
                    >
                      <div className="h-8 rounded-2xs bg-layer-1 border-sm border-border-default p-3xs flex items-center">
                        <div
                          className="w-full h-full rounded-2xs bg-primary"
                          style={{ opacity: v(t.id) }}
                        />
                      </div>
                      <strong className="text-label-xs text-on-surface">{leafName(t)}</strong>
                      <code className="text-mono-xs text-on-surface-muted">
                        {String(val(t.id) ?? '')}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {globalOpacity.length > 0 && (
              <div className="flex flex-col gap-xs pt-xs">
                <h3 className="text-label-md text-on-surface m-0">
                  Global · 透明度尺度（pd.global.opacity.*）
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-xs">
                  {globalOpacity.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onJump(t.id)}
                      title={t.id}
                      className="flex flex-col gap-3xs p-xs rounded-xs bg-layer-2 border-sm border-border-subtle cursor-pointer"
                    >
                      <div className="h-6 rounded-2xs bg-layer-1 border-sm border-border-default p-3xs">
                        <div
                          className="w-full h-full rounded-2xs bg-primary"
                          style={{ opacity: v(t.id) }}
                        />
                      </div>
                      <code className="text-mono-xs text-on-surface">
                        {leafName(t)} · {String(val(t.id) ?? '')}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PreviewSection>
        )}
      </div>
    </div>
  )
}
