import { useState } from 'react'
import { parseDate, type CalendarDate } from '@internationalized/date'
import {
  Autocomplete,
  AutocompleteItem,
  Breadcrumbs,
  Button,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  ComboBoxItem,
  DateField,
  DatePicker,
  Disclosure,
  DisclosureGroup,
  FileTrigger,
  Form,
  FormActions,
  FormSection,
  Menu,
  Modal,
  Popover,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Separator,
  Sheet,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tree,
  TreeItem,
  TreeItemContent,
  toast,
  type MenuItemData
} from '@pact-design/react'

interface CheckOptionsState {
  compact: boolean
  apca: boolean
  tokens: boolean
  disabledChecked: boolean
}

interface CityOption {
  id: string
  name: string
}

export function ComponentPlayground() {
  const [lastAction, setLastAction] = useState<string>('Ready — interact with any React Aria control below')
  const [checks, setChecks] = useState<CheckOptionsState>({
    compact: true,
    apca: true,
    tokens: false,
    disabledChecked: true
  })
  const [switchState, setSwitchState] = useState<boolean>(true)
  const [toggleState, setToggleState] = useState<boolean>(false)
  const [textValue, setTextValue] = useState<string>('Pact Design System')
  const [dateValue, setDateValue] = useState<CalendarDate>(() => parseDate('2026-11-13'))
  const [selectedCity, setSelectedCity] = useState<string>('taipei')
  const [selectedRole, setSelectedRole] = useState<string>('admin')
  const [radioTier, setRadioTier] = useState<string>('system')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const cities: CityOption[] = [
    { id: 'taipei', name: 'Taipei (TPE)' },
    { id: 'tokyo', name: 'Tokyo (TYO)' },
    { id: 'london', name: 'London (LON)' },
    { id: 'sf', name: 'San Francisco (SFO)' },
    { id: 'berlin', name: 'Berlin (BER)' }
  ]

  const menuItems: MenuItemData[] = [
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

        <div className="flex flex-col gap-sm pt-xs border-t border-border-subtle">
          <span className="text-caption-sm text-on-surface-muted font-medium">Radius Overrides (data-radius)</span>
          <div className="flex flex-wrap items-center gap-sm">
            {(['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
              <Button
                key={radius}
                variant="secondary"
                size="sm"
                radius={radius}
                onPress={() => setLastAction(`Radius: ${radius}`)}
              >
                {radius}
              </Button>
            ))}
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

      {/* 3b. RadioGroup & Separator */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
          <div className="flex flex-col gap-2xs">
            <h2 className="text-heading-sm text-on-surface">Radio & RadioGroup</h2>
            <p className="text-body-sm text-on-surface-muted m-0">
              Mutually exclusive radio options with labels, descriptions, and keyboard navigation.
            </p>
          </div>

          <RadioGroup
            label="Token Tier Scope"
            description="Choose which token layer to inspect"
            value={radioTier}
            onChange={(val) => {
              setRadioTier(val)
              setLastAction(`RadioGroup: ${val}`)
            }}
          >
            <Radio
              value="global"
              label="Global Primitives"
              description="Raw OKLCH palettes, dimensions, and motion curves."
            />
            <Radio
              value="system"
              label="System Semantic"
              description="Theme-aware background, surface, and status roles."
            />
            <Radio
              value="component"
              label="Component Slots"
              description="Scoped button, field, and overlay overrides."
            />
            <Radio value="locked" label="Legacy Tier (Disabled)" disabled />
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
          <div className="flex flex-col gap-2xs">
            <h2 className="text-heading-sm text-on-surface">Separator</h2>
            <p className="text-body-sm text-on-surface-muted m-0">
              Accessible horizontal and vertical dividers using subtle, default, and strong border tones.
            </p>
          </div>

          <div className="flex flex-col gap-sm">
            <span className="text-caption-sm text-on-surface-muted font-medium">Horizontal (subtle · default · strong)</span>
            <Separator tone="subtle" />
            <Separator tone="default" />
            <Separator tone="strong" />
          </div>

          <div className="flex items-center gap-sm h-control-md px-sm rounded-xs bg-layer-1 border border-border-subtle">
            <span className="text-label-sm text-on-surface">Tokens</span>
            <Separator orientation="vertical" tone="default" />
            <span className="text-label-sm text-on-surface">Components</span>
            <Separator orientation="vertical" tone="default" />
            <span className="text-label-sm text-on-surface-muted">Docs</span>
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
              <span className="text-label-sm font-bold text-on-surface">Floating Inspector</span>
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

          <Sheet
            trigger={<Button variant="secondary">Open Sheet</Button>}
            position="right"
            size="md"
            title="Token Inspector Sheet"
            description="Swipeable edge drawer powered by React Aria Sheet."
            footer={(
              <Button variant="primary" size="sm" onPress={() => setLastAction('Sheet Action')}>
                Apply Tokens
              </Button>
            )}
          >
            <p className="text-body-sm text-on-surface m-0">
              Sheets slide in from any viewport edge (<code>left</code>, <code>right</code>, <code>top</code>, <code>bottom</code>) and support swipe-to-dismiss and Escape key handling.
            </p>
          </Sheet>
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

      {/* 5b. Tree */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Tree</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Hierarchical tree grid with keyboard arrow navigation, expandable branches, and multi-select checkboxes.
          </p>
        </div>

        <Tree
          aria-label="Token Files"
          selectionMode="multiple"
          defaultExpandedKeys={['tokens', 'system']}
          onSelectionChange={(keys) => setLastAction(`Tree Selection: ${keys === 'all' ? 'all' : [...keys].join(', ') || 'none'}`)}
        >
          <TreeItem id="tokens" textValue="tokens">
            <TreeItemContent>packages/tokens/src</TreeItemContent>
            <TreeItem id="global" textValue="global">
              <TreeItemContent>global</TreeItemContent>
              <TreeItem id="global-color" textValue="color.json">
                <TreeItemContent>color.json</TreeItemContent>
              </TreeItem>
              <TreeItem id="global-spacing" textValue="spacing.json">
                <TreeItemContent>spacing.json</TreeItemContent>
              </TreeItem>
            </TreeItem>
            <TreeItem id="system" textValue="system">
              <TreeItemContent>system</TreeItemContent>
              <TreeItem id="system-light" textValue="color.light.json">
                <TreeItemContent>color.light.json</TreeItemContent>
              </TreeItem>
              <TreeItem id="system-dark" textValue="color.dark.json">
                <TreeItemContent>color.dark.json</TreeItemContent>
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </Tree>
      </section>

      {/* 6. Form Fields: TextField, ComboBox, DateField, DatePicker */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Form Fields (TextField, ComboBox, DateField, DatePicker)</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Input fields built with shared <code>Field</code> primitives (`Label`, `FieldGroup`, `FieldError`, `FieldDescription`).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
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

          <DatePicker
            label="Release Date"
            description="Pick a target release date"
            value={dateValue}
            onChange={(val) => {
              if (val) {
                setDateValue(val)
                setLastAction(`DatePicker: ${val.toString()}`)
              }
            }}
          />
        </div>
      </section>

      {/* 7. Navigation: Breadcrumbs & Tabs */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Navigation (Breadcrumbs & Tabs)</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Hierarchical path navigation with Breadcrumbs and multi-variant Tabs (`underline`, `segmented`, `pill`).
          </p>
        </div>

        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-2xs">
            <span className="text-caption-sm text-on-surface-muted font-medium">Breadcrumbs</span>
            <Breadcrumbs
              items={[
                { id: 'home', label: 'Home', href: '#' },
                { id: 'components', label: 'Components', href: '#' },
                { id: 'react', label: 'React Aria' }
              ]}
              onAction={(key) => setLastAction(`Breadcrumb: ${key}`)}
            />
          </div>

          <div className="flex flex-col gap-sm">
            <span className="text-caption-sm text-on-surface-muted font-medium">Tabs (Underline Variant)</span>
            <Tabs defaultSelectedKey="tab-tokens">
              <TabList>
                <Tab id="tab-tokens">Design Tokens</Tab>
                <Tab id="tab-components">React Components</Tab>
                <Tab id="tab-accessibility">APCA Calibration</Tab>
              </TabList>
              <TabPanel id="tab-tokens">
                Three-tier architecture: Global, System Semantic, and Component-scoped tokens.
              </TabPanel>
              <TabPanel id="tab-components">
                20 accessible components built with React Aria and Pact Design tokens.
              </TabPanel>
              <TabPanel id="tab-accessibility">
                Calibrated against APCA-W3 for verified perceptual text readability.
              </TabPanel>
            </Tabs>
          </div>

          <div className="flex flex-col gap-sm">
            <span className="text-caption-sm text-on-surface-muted font-medium">Tabs (Segmented Variant)</span>
            <Tabs variant="segmented" defaultSelectedKey="preview">
              <TabList>
                <Tab id="preview">Interactive Preview</Tab>
                <Tab id="code">TSX Source</Tab>
                <Tab id="props">Component API</Tab>
              </TabList>
              <TabPanel id="preview">Live reactive render playground.</TabPanel>
              <TabPanel id="code">Clean copy-pasteable TSX snippets.</TabPanel>
              <TabPanel id="props">Complete TypeScript props and slot definitions.</TabPanel>
            </Tabs>
          </div>
        </div>
      </section>

      {/* 8. Selection & Search: Select & Autocomplete */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Selection & Filtering (Select & Autocomplete)</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Accessible pickers with single/multi selection and filter-as-you-type search suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <Select
            label="Assigned Role"
            description="Choose access level for collaborator"
            selectedKey={selectedRole}
            onSelectionChange={(key) => {
              setSelectedRole(String(key))
              setLastAction(`Select: ${key}`)
            }}
          >
            <SelectItem id="viewer">Viewer (Read-only)</SelectItem>
            <SelectItem id="editor">Editor (Can edit tokens & components)</SelectItem>
            <SelectItem id="admin">Administrator (Full workspace rights)</SelectItem>
          </Select>

          <Autocomplete
            label="Search System Tokens"
            description="Type a token category (e.g. color, elevation, motion)"
            placeholder="Search tokens..."
            listBoxProps={{
              onAction: (key) => setLastAction(`Autocomplete: ${key}`)
            }}
          >
            <AutocompleteItem id="color-primary">color-primary (Brand theme accent)</AutocompleteItem>
            <AutocompleteItem id="color-surface">color-surface (Base UI backgrounds)</AutocompleteItem>
            <AutocompleteItem id="elevation-lg">elevation-lg (Floating popovers & modals)</AutocompleteItem>
            <AutocompleteItem id="motion-fast">motion-fast (Interactive micro-interactions)</AutocompleteItem>
            <AutocompleteItem id="control-md">control-md (32px standard input height)</AutocompleteItem>
          </Autocomplete>
        </div>
      </section>

      {/* 9. Form, FileTrigger & Toast */}
      <section className="flex flex-col gap-md p-lg rounded-md bg-layer-2 border border-border-default">
        <div className="flex flex-col gap-2xs">
          <h2 className="text-heading-sm text-on-surface">Form, FileTrigger & Toast</h2>
          <p className="text-body-sm text-on-surface-muted m-0">
            Composite form layout with file trigger upload and floating notification toast system.
          </p>
        </div>

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            toast.success('Form Submitted', 'Workspace settings have been updated.')
            setLastAction('Form: Submitted')
          }}
        >
          <FormSection
            title="Artifact Asset Submission"
            description="Upload icon SVG or token bundle specification"
          >
            <div className="flex items-center gap-md">
              <FileTrigger
                acceptedFileTypes={['.json', '.svg', '.png']}
                onSelect={(files) => {
                  if (files && files.length > 0) {
                    setSelectedFile(files[0].name)
                    toast.info('File Selected', files[0].name)
                    setLastAction(`FileTrigger: ${files[0].name}`)
                  }
                }}
              />
              <span className="text-caption-md text-on-surface-muted">
                {selectedFile ? `Selected: ${selectedFile}` : 'No file chosen yet'}
              </span>
            </div>
          </FormSection>

          <FormActions>
            <Button
              type="button"
              variant="subtle"
              onPress={() => {
                setSelectedFile(null)
                setLastAction('Form: Reset')
              }}
            >
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </FormActions>
        </Form>

        <div className="flex flex-col gap-xs pt-sm border-t border-border-subtle">
          <span className="text-caption-sm text-on-surface-muted font-medium">Trigger Toast Notifications</span>
          <div className="flex flex-wrap gap-sm">
            <Button
              variant="subtle"
              onPress={() => toast.info('Information', 'A new token version is available.')}
            >
              Info Toast
            </Button>
            <Button
              variant="subtle"
              onPress={() => toast.success('Saved Successfully', 'Token variables synced.')}
            >
              Success Toast
            </Button>
            <Button
              variant="subtle"
              onPress={() => toast.warning('Low Contrast Warning', 'Subtle border requires check.')}
            >
              Warning Toast
            </Button>
            <Button
              variant="danger"
              onPress={() => toast.danger('Action Failed', 'Could not export DTCG format.')}
            >
              Danger Toast
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ComponentPlayground
