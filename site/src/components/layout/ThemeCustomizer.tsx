import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Popover,
  Separator,
  Tooltip,
  TooltipTrigger,
  toast
} from '@pact-design/react'
import {
  RiCheckLine,
  RiFileCopyLine,
  RiPaletteLine,
  RiRestartLine
} from '@remixicon/react'
import {
  applySiteTheme,
  buildSiteThemeCss,
  DEFAULT_SITE_THEME,
  EXPOSED_THEME_VARS,
  isDefaultSiteTheme,
  ROLE_PRESETS,
  SURFACE_PRESETS,
  type SiteThemeSelection
} from '../../utils/site-theme'

interface SwatchOption {
  id: string
  label: string
  swatchColor: string
}

interface SwatchGroupProps {
  title: string
  activeLabel: string
  options: ReadonlyArray<SwatchOption>
  selectedId: string
  onSelect: (id: string) => void
}

function SwatchGroup({
  title,
  activeLabel,
  options,
  selectedId,
  onSelect
}: SwatchGroupProps) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <span className="text-label-xs font-medium text-fg">{title}</span>
        <span className="text-caption-sm text-fg-subtle">{activeLabel}</span>
      </div>
      <div className="grid grid-cols-5 gap-xs" role="radiogroup" aria-label={title}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedId
          return (
            <TooltipTrigger key={opt.id} delay={400}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${title}: ${opt.label}`}
                onClick={() => onSelect(opt.id)}
                className={[
                  'w-7 h-7 rounded-full cursor-pointer transition-transform border-sm',
                  'flex items-center justify-center p-0 mx-auto',
                  isSelected
                    ? 'ring-2 ring-focus ring-offset-2 ring-offset-layer-2 border-transparent scale-105'
                    : 'border-default hover:scale-110'
                ].join(' ')}
                style={{ backgroundColor: opt.swatchColor }}
              >
                {isSelected && (
                  <RiCheckLine className="w-3.5 h-3.5 text-on-primary drop-shadow-xs" aria-hidden="true" />
                )}
              </button>
              <Tooltip>{opt.label}</Tooltip>
            </TooltipTrigger>
          )
        })}
      </div>
    </div>
  )
}

export function ThemeCustomizer() {
  const [selection, setSelection] = useState<SiteThemeSelection>(DEFAULT_SITE_THEME)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    applySiteTheme(selection)
  }, [selection])

  const isDefault = isDefaultSiteTheme(selection)
  const primaryLabel = ROLE_PRESETS.find((p) => p.id === selection.primary)?.label ?? selection.primary
  const secondaryLabel = ROLE_PRESETS.find((p) => p.id === selection.secondary)?.label ?? selection.secondary
  const surfaceLabel = SURFACE_PRESETS.find((p) => p.id === selection.surface)?.label ?? selection.surface

  const handleCopyCss = async() => {
    const css = buildSiteThemeCss(selection) || '/* Using default Pact Design theme tokens */'
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      toast.success('已複製主題 CSS 變數', undefined, { timeout: 1800 })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.danger('無法寫入剪貼簿', undefined, { timeout: 2000 })
    }
  }

  return (
    <Popover
      contentProps={{ placement: 'bottom end', className: 'w-18rem' }}
      dialogProps={{ className: 'p-md flex flex-col gap-md' }}
      trigger={(
        <Button
          variant="ghost"
          size="sm"
          icon
          aria-label="預覽主題配色"
          className="relative"
        >
          <RiPaletteLine />
          {!isDefault && (
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
          )}
        </Button>
      )}
    >
      <div className="flex items-center justify-between gap-xs">
        <span className="text-label-sm font-semibold text-fg">Theme Preview</span>
        <div className="flex items-center gap-2xs">
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="xs"
              icon
              isDisabled={isDefault}
              aria-label="複製主題 CSS"
              onPress={handleCopyCss}
            >
              {copied ? <RiCheckLine /> : <RiFileCopyLine />}
            </Button>
            <Tooltip>複製覆寫 CSS</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="xs"
              icon
              isDisabled={isDefault}
              aria-label="重設預設主題"
              onPress={() => setSelection(DEFAULT_SITE_THEME)}
            >
              <RiRestartLine />
            </Button>
            <Tooltip>重設預設值</Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      <SwatchGroup
        title="Primary"
        activeLabel={primaryLabel}
        options={ROLE_PRESETS}
        selectedId={selection.primary}
        onSelect={(id) => setSelection((prev) => ({ ...prev, primary: id as SiteThemeSelection['primary'] }))}
      />

      <SwatchGroup
        title="Secondary"
        activeLabel={secondaryLabel}
        options={ROLE_PRESETS}
        selectedId={selection.secondary}
        onSelect={(id) => setSelection((prev) => ({ ...prev, secondary: id as SiteThemeSelection['secondary'] }))}
      />

      <SwatchGroup
        title="Surface"
        activeLabel={surfaceLabel}
        options={SURFACE_PRESETS}
        selectedId={selection.surface}
        onSelect={(id) => setSelection((prev) => ({ ...prev, surface: id as SiteThemeSelection['surface'] }))}
      />

      <Separator />

      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <span className="text-label-xs font-medium text-fg">Theme Variables</span>
          <div className="flex items-center gap-2xs">
            <Badge tone="primary" variant="solid" size="xs">Primary</Badge>
            <Badge tone="secondary" variant="solid" size="xs">Secondary</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2xs">
          {EXPOSED_THEME_VARS.map(({ cssVar }) => (
            <div
              key={cssVar}
              className="flex items-center justify-between gap-xs px-xs py-3xs rounded-2xs bg-layer-1 border-sm border-subtle"
            >
              <code className="text-mono-xs text-fg-muted truncate">{cssVar}</code>
              <span
                className="w-3.5 h-3.5 rounded-2xs shrink-0 border-sm border-default"
                style={{ backgroundColor: `var(${cssVar})` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </Popover>
  )
}
