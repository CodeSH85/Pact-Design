import { useState } from 'react'
import { parseDate } from '@internationalized/date'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  ComboBoxItem,
  DateField,
  Disclosure,
  DisclosureGroup,
  Menu,
  Modal,
  Popover,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@pact-design/react'

export function ComponentPlayground() {
  const [lastAction, setLastAction] = useState('Ready — interact with any React Aria control below')
  const [checks, setChecks] = useState({
    compact: true,
    apca: true,
    tokens: false,
    disabledChecked: true
  })
  const [switchState, setSwitchState] = useState(true)
  const [toggleState, setToggleState] = useState(false)
  const [textValue, setTextValue] = useState('Pact Design System')
  const [dateValue, setDateValue] = useState(() => parseDate('2026-11-13'))
  const [selectedCity, setSelectedCity] = useState('taipei')

  const cities = [
    { id: 'taipei', name: 'Taipei (TPE)' },
    { id: 'tokyo', name: 'Tokyo (TYO)' },
    { id: 'london', name: 'London (LON)' },
    { id: 'sf', name: 'San Francisco (SFO)' },
    { id: 'berlin', name: 'Berlin (BER)' }
  ]

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
        setSwitchState(true)
        setToggleState(false)
        setTextValue('Pact Design System')
        setDateValue(parseDate('2026-11-13'))
        setSelectedCity('taipei')
        setLastAction('Menu: Reset Playground State')
      }
    }
  ]

  return (
    <div className="flex flex-col gap-xl">
      {/* Live status bar */}
      <div className="flex items-center justify-between px-md py-sm rounded-sm bg-layer-2 border border-border-subtle sticky top-0 z-docked shadow-elevation-xs">
        <span className="text-caption-md font-medium text-on-surface-secondary">Event Log</span>
        <code className="text-mono-xs text-primary">{lastAction}</code>
      </div>

      {/* 1. Button Showcase */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Button</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Semantic action buttons with T-shirt control heights (`xs` to `xl`) and focus rings.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          <span className="text-caption-sm text-on-surface-muted font-medium">Variants (size=&quot;md&quot;)</span>
          <div className="flex flex-wrap items-center gap-sm">
            <Button variant="primary" onPress={() => setLastAction('Clicked Primary Button')}>
              Primary
            </Button>
            <Button variant="secondary" onPress={() => setLastAction('Clicked Secondary Button')}>
              Secondary
            </Button>
            <Button variant="subtle" onPress={() => setLastAction('Clicked Subtle Button')}>
              Subtle
            </Button>
            <Button variant="ghost" onPress={() => setLastAction('Clicked Ghost Button')}>
              Ghost
            </Button>
            <Button variant="danger" onPress={() => setLastAction('Clicked Danger Button')}>
              Danger
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-sm pt-xs border-t border-border-subtle">
          <span className="text-caption-sm text-on-surface-muted font-medium">Control Height Scale (xs: 24px · sm: 28px · md: 32px · lg: 36px · xl: 40px)</span>
          <div className="flex flex-wrap items-end gap-sm">
            <Button variant="secondary" size="xs" onPress={() => setLastAction('Size: xs (24px)')}>
              Control XS
            </Button>
            <Button variant="secondary" size="sm" onPress={() => setLastAction('Size: sm (28px)')}>
              Control SM
            </Button>
            <Button variant="secondary" size="md" onPress={() => setLastAction('Size: md (32px)')}>
              Control MD
            </Button>
            <Button variant="secondary" size="lg" onPress={() => setLastAction('Size: lg (36px)')}>
              Control LG
            </Button>
            <Button variant="secondary" size="xl" onPress={() => setLastAction('Size: xl (40px)')}>
              Control XL
            </Button>
          </div>
        </div>
      </section>

      {/* 2. ToggleButton & ToggleButtonGroup */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">ToggleButton & ToggleButtonGroup</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Two-state toggle buttons with active surface layers and segmented button groups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-lg">
          <ToggleButton
            isSelected={toggleState}
            onChange={(selected) => {
              setToggleState(selected)
              setLastAction(`ToggleButton: ${selected ? 'Selected' : 'Unselected'}`)
            }}
          >
            Pin Panel ({toggleState ? 'Pinned' : 'Unpinned'})
          </ToggleButton>

          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['grid']}>
            <ToggleButton id="list" size="sm" onPress={() => setLastAction('View: List')}>
              List View
            </ToggleButton>
            <ToggleButton id="grid" size="sm" onPress={() => setLastAction('View: Grid')}>
              Grid View
            </ToggleButton>
            <ToggleButton id="table" size="sm" onPress={() => setLastAction('View: Table')}>
              Table View
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </section>

      {/* 3. Checkbox & Switch Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
          <div className="flex flex-col gap-2xs">
            <h2 className="text-heading-sm text-on-surface">Checkbox</h2>
            <p className="text-body-sm text-on-surface-muted m-0">
              Compact checkbox with Remix icons for checked & indeterminate states.
            </p>
          </div>

          <CheckboxGroup label="UI Density Options" description="Select dense configuration options">
            <Checkbox
              checked={checks.compact}
              onCheckedChange={(val) => {
                setChecks((prev) => ({ ...prev, compact: val }))
                setLastAction(`Checkbox Compact: ${val ? 'Checked' : 'Unchecked'}`)
              }}
              label="Enable compact layout"
              description="Uses 4px base grid and 28px–32px control heights."
            />
            <Checkbox
              checked={checks.apca}
              onCheckedChange={(val) => {
                setChecks((prev) => ({ ...prev, apca: val }))
                setLastAction(`Checkbox APCA: ${val ? 'Checked' : 'Unchecked'}`)
              }}
              label="Enforce APCA contrast guard"
              description="Guarantees |Lc| >= 60 contrast compliance."
            />
            <Checkbox
              disabled
              checked={checks.disabledChecked}
              label="Disabled selected option"
            />
          </CheckboxGroup>
        </div>

        <div className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
          <div className="flex flex-col gap-2xs">
            <h2 className="text-heading-sm text-on-surface">Switch</h2>
            <p className="text-body-sm text-on-surface-muted m-0">
              Pill toggle track with functional duration-normal motion curve.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <Switch
              size="md"
              checked={switchState}
              onCheckedChange={(val) => {
                setSwitchState(val)
                setLastAction(`Switch (md): ${val ? 'On' : 'Off'}`)
              }}
              label="Realtime Token Telemetry"
              description="Streams token updates to live preview panes."
            />

            <Switch
              size="sm"
              defaultChecked={false}
              onChange={(val) => setLastAction(`Switch (sm): ${val ? 'On' : 'Off'}`)}
              label="Compact Switch (size=sm)"
            />

            <Switch
              disabled
              defaultChecked
              label="Disabled active switch"
            />
          </div>
        </div>
      </section>

      {/* 4. Menu, Popover & Modal Overlays */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Menu, Popover & Modal Overlays</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Layered floating containers with elevation shadows, backdrop scrims, and keyboard accessibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-md">
          <Menu triggerLabel="Token Menu" items={menuItems} />

          <Popover
            trigger={<Button variant="secondary">Open Popover</Button>}
          >
            <div className="flex flex-col gap-xs p-xs">
              <span className="text-label-sm font-semibold text-on-surface">Floating Inspector</span>
              <p className="text-caption-md text-on-surface-muted m-0">
                Pact Design popovers use bg-elevated and shadow-elevation-lg.
              </p>
            </div>
          </Popover>

          <Modal
            trigger={<Button variant="primary">Launch Modal</Button>}
            title="Design System Calibration"
            description="Inspect system tokens and APCA contrast thresholds."
            footer={(
              <>
                <Button variant="ghost" size="sm" onPress={() => setLastAction('Modal Cancel')}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onPress={() => setLastAction('Modal Confirmed')}>
                  Confirm Changes
                </Button>
              </>
            )}
          >
            <p className="text-body-sm text-on-surface m-0">
              This modal dialog is rendered in a portal with a scrim backdrop (<code>bg-backdrop</code>) and centered <code>bg-elevated</code> container.
            </p>
          </Modal>
        </div>
      </section>

      {/* 5. Disclosure & DisclosureGroup */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Disclosure & DisclosureGroup</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Expandable accordion panels with rotating Remix Icon chevron indicators.
          </p>
        </div>

        <DisclosureGroup defaultExpandedKeys={['tokens']}>
          <Disclosure id="tokens" title="1. Design Token Architecture">
            Pact Design organizes tokens into a three-tier hierarchy: Global (raw primitives), System (themeable semantic roles), and Component (scoped slot overrides).
          </Disclosure>
          <Disclosure id="contrast" title="2. Perceptual Contrast Standard">
            Calibrated against the official APCA-W3 algorithm ensuring |Lc| &gt;= 60 for all solid foreground/background pairings.
          </Disclosure>
          <Disclosure id="density" title="3. Information Density">
            Control heights range from 24px (xs) to 40px (xl), optimized for dense dashboards and enterprise data grids.
          </Disclosure>
        </DisclosureGroup>
      </section>

      {/* 6. Form Fields: TextField, ComboBox, DateField */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Form Fields (TextField, ComboBox, DateField)</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Input fields built with shared <code>Field</code> primitives (`Label`, `FieldGroup`, `FieldError`, `FieldDescription`).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <TextField
            label="Workspace Title"
            description="Enter a domain-neutral workspace name"
            value={textValue}
            onChange={(val) => {
              setTextValue(val)
              setLastAction(`TextField: ${val}`)
            }}
          />

          <ComboBox
            label="Default Region"
            description="Select application deployment region"
            items={cities}
            selectedKey={selectedCity}
            onSelectionChange={(key) => {
              setSelectedCity(String(key))
              setLastAction(`ComboBox: ${key}`)
            }}
          >
            {(item) => <ComboBoxItem id={item.id}>{item.name}</ComboBoxItem>}
          </ComboBox>

          <DateField
            label="Audit Date"
            description="APCA contrast certification date"
            value={dateValue}
            onChange={(val) => {
              if (val) {
                setDateValue(val)
                setLastAction(`DateField: ${val.toString()}`)
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default ComponentPlayground
