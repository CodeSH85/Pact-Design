import { useState } from 'react'
import { Button } from './Button.jsx'
import { Checkbox } from './Checkbox.jsx'
import { Menu } from './Menu.jsx'

export function ComponentPlayground() {
  const [lastAction, setLastAction] = useState('Ready — interact with any React Aria control below')
  const [checks, setChecks] = useState({
    compact: true,
    apca: true,
    tokens: false,
    disabledChecked: true
  })

  const menuItems = [
    {
      type: 'group',
      label: 'Token Operations',
      items: [
        { label: 'Inspect CSS Variables', shortcut: '⌘I', onClick: () => setLastAction('Menu: Inspect CSS Variables') },
        { label: 'Copy UnoCSS Class', shortcut: '⌘C', onClick: () => setLastAction('Menu: Copy UnoCSS Class') },
        { label: 'Export DTCG JSON', shortcut: '⇧⌘E', onClick: () => setLastAction('Menu: Export DTCG JSON') }
      ]
    },
    { type: 'separator' },
    { label: 'Sync Component Tier (WIP)', disabled: true },
    { type: 'separator' },
    {
      label: 'Reset Playground State',
      tone: 'danger',
      shortcut: '⌘⌫',
      onClick: () => {
        setChecks({ compact: true, apca: true, tokens: false, disabledChecked: true })
        setLastAction('Menu: Reset Playground State')
      }
    }
  ]

  return (
    <div className="flex flex-col gap-xl">
      {/* Live status bar */}
      <div className="flex items-center justify-between px-md py-sm rounded-sm bg-layer-2 border border-border-subtle">
        <span className="text-caption-md text-on-surface-secondary">Event Log</span>
        <code className="text-mono-xs text-on-surface">{lastAction}</code>
      </div>

      {/* 1. Button Showcase */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Button (react-aria-components)</h2>
          <p className="text-body-sm text-on-surface-muted">
            Uses system semantic colors, surface layers, control heights (h-control-xs to xl), and label typography.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          <span className="text-caption-sm text-on-surface-muted">Variants (size=&quot;md&quot;)</span>
          <div className="flex flex-wrap items-center gap-sm">
            <Button variant="primary" onClick={() => setLastAction('Clicked Primary Button')}>
              Primary Action
            </Button>
            <Button variant="secondary" onClick={() => setLastAction('Clicked Secondary Button')}>
              Secondary
            </Button>
            <Button variant="subtle" onClick={() => setLastAction('Clicked Subtle Button')}>
              Subtle Info
            </Button>
            <Button variant="ghost" onClick={() => setLastAction('Clicked Ghost Button')}>
              Ghost
            </Button>
            <Button variant="danger" onClick={() => setLastAction('Clicked Danger Button')}>
              Danger
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-sm pt-xs border-t border-border-subtle">
          <span className="text-caption-sm text-on-surface-muted">Control Height Scale (xs · sm · md · lg · xl)</span>
          <div className="flex flex-wrap items-end gap-sm">
            <Button variant="secondary" size="xs" onClick={() => setLastAction('Size: xs (24px)')}>
              Control XS
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setLastAction('Size: sm (28px)')}>
              Control SM
            </Button>
            <Button variant="secondary" size="md" onClick={() => setLastAction('Size: md (32px)')}>
              Control MD
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setLastAction('Size: lg (36px)')}>
              Control LG
            </Button>
            <Button variant="secondary" size="xl" onClick={() => setLastAction('Size: xl (40px)')}>
              Control XL
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Checkbox Showcase */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Checkbox (react-aria-components)</h2>
          <p className="text-body-sm text-on-surface-muted">
            Styled via React Aria group-data-[selected] and group-data-[disabled] attributes paired with w-icon-md, border-strong, and primary tokens.
          </p>
        </div>

        <div className="flex flex-col gap-md">
          <Checkbox
            checked={checks.compact}
            onCheckedChange={(val) => {
              setChecks((prev) => ({ ...prev, compact: val }))
              setLastAction(`Checkbox "Compact Density": ${val ? 'Checked' : 'Unchecked'}`)
            }}
            label="Enable compact UI density"
            description="Uses 4px base grid and compact control heights (28px–32px) by default."
          />

          <Checkbox
            checked={checks.apca}
            onCheckedChange={(val) => {
              setChecks((prev) => ({ ...prev, apca: val }))
              setLastAction(`Checkbox "APCA Contrast Guard": ${val ? 'Checked' : 'Unchecked'}`)
            }}
            label="Enforce APCA contrast thresholds"
            description="Validates on-surface text hierarchy across light and dark themes."
          />

          <Checkbox
            checked={checks.tokens}
            onCheckedChange={(val) => {
              setChecks((prev) => ({ ...prev, tokens: val }))
              setLastAction(`Checkbox "Component Tier Tokens": ${val ? 'Checked' : 'Unchecked'}`)
            }}
            label="Emit component-tier CSS variables"
            description="Experimental third tier (--component-button-*, --component-menu-*)."
          />

          <div className="flex flex-wrap gap-lg pt-xs border-t border-border-subtle">
            <Checkbox
              disabled
              defaultChecked={false}
              label="Disabled unchecked"
            />
            <Checkbox
              disabled
              checked={checks.disabledChecked}
              label="Disabled checked"
            />
          </div>
        </div>
      </section>

      {/* 3. Menu Showcase */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Menu (react-aria-components)</h2>
          <p className="text-body-sm text-on-surface-muted">
            Demonstrates bg-elevated surface, shadow-elevation-lg, z-dropdown, and data-[focused]:bg-layer-2-hover.
          </p>
        </div>

        <div className="flex items-center gap-md">
          <Menu triggerLabel="Open Token Menu" items={menuItems} />
          <span className="text-caption-md text-on-surface-muted">
            Supports arrow key navigation, keyboard shortcuts display, and danger item states.
          </span>
        </div>
      </section>
    </div>
  )
}
