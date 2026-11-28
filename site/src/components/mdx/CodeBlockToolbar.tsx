import { Button, ToggleButton, Tooltip, TooltipTrigger } from '@pact-design/react'
import { RiCheckLine, RiCodeSSlashLine, RiFileCopyLine } from '@remixicon/react'

export interface CodeBlockToolbarProps {
  language?: string
  copied: boolean
  expanded: boolean
  onCopy: () => void
  onToggleExpand: () => void
}

export function CodeBlockToolbar({
  language,
  copied,
  expanded,
  onCopy,
  onToggleExpand
}: CodeBlockToolbarProps) {
  const copyLabel = copied ? '已複製' : '複製程式碼'
  const expandLabel = expanded ? '收合程式碼' : '展開程式碼'

  return (
    <div className="flex items-center justify-between py-2xs bg-layer-1 rounded-t-xs">
      <span className="text-mono-xs text-fg-subtle select-none">
        {language && language !== 'text' ? language : 'code'}
      </span>

      <div className="flex items-center gap-2xs">
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label={copyLabel}
            onPress={onCopy}
            className={copied ? 'text-primary' : undefined}
          >
            {copied ? <RiCheckLine /> : <RiFileCopyLine />}
          </Button>
          <Tooltip>{copyLabel}</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <ToggleButton
            variant="ghost"
            size="sm"
            icon
            aria-label={expandLabel}
            isSelected={expanded}
            onChange={onToggleExpand}
          >
            <RiCodeSSlashLine />
          </ToggleButton>
          <Tooltip>{expandLabel}</Tooltip>
        </TooltipTrigger>
      </div>
    </div>
  )
}
