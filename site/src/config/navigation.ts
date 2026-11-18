export type NavItem =
  | {
    id: string
    label: string
    title: string
    to: '/' | '/components/playground'
    params?: undefined
  }
  | {
    id: string
    label: string
    title: string
    to: '/foundations/$id' | '/components/$id'
    params: { id: string }
  }

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: 'Pact Design',
    items: [
      { id: 'introduction', label: '介紹', title: '介紹', to: '/' }
    ]
  },
  {
    title: '基礎',
    items: [
      { id: 'color', label: '色彩', title: '色彩', to: '/foundations/$id', params: { id: 'color' } },
      { id: 'typography', label: '字體', title: '字體', to: '/foundations/$id', params: { id: 'typography' } },
      { id: 'spacing', label: '間距', title: '間距', to: '/foundations/$id', params: { id: 'spacing' } },
      { id: 'sizing', label: '尺寸', title: '尺寸', to: '/foundations/$id', params: { id: 'sizing' } },
      { id: 'elevation', label: '陰影', title: '陰影', to: '/foundations/$id', params: { id: 'elevation' } },
      { id: 'motion', label: '動態', title: '動態', to: '/foundations/$id', params: { id: 'motion' } },
      { id: 'architecture', label: 'Design Token', title: 'Design Token', to: '/foundations/$id', params: { id: 'architecture' } }
    ]
  },
  {
    title: '元件',
    items: [
      { id: 'autocomplete', label: 'Autocomplete', title: 'Autocomplete', to: '/components/$id', params: { id: 'autocomplete' } },
      { id: 'breadcrumbs', label: 'Breadcrumbs', title: 'Breadcrumbs', to: '/components/$id', params: { id: 'breadcrumbs' } },
      { id: 'button', label: 'Button', title: 'Button', to: '/components/$id', params: { id: 'button' } },
      { id: 'calendar', label: 'Calendar', title: 'Calendar', to: '/components/$id', params: { id: 'calendar' } },
      { id: 'checkbox', label: 'Checkbox', title: 'Checkbox', to: '/components/$id', params: { id: 'checkbox' } },
      { id: 'combobox', label: 'ComboBox', title: 'ComboBox', to: '/components/$id', params: { id: 'combobox' } },
      { id: 'date-field', label: 'DateField', title: 'DateField', to: '/components/$id', params: { id: 'date-field' } },
      { id: 'date-picker', label: 'DatePicker', title: 'DatePicker', to: '/components/$id', params: { id: 'date-picker' } },
      { id: 'dialog', label: 'Dialog', title: 'Dialog', to: '/components/$id', params: { id: 'dialog' } },
      { id: 'disclosure', label: 'Disclosure', title: 'Disclosure', to: '/components/$id', params: { id: 'disclosure' } },
      { id: 'disclosure-group', label: 'DisclosureGroup', title: 'DisclosureGroup', to: '/components/$id', params: { id: 'disclosure-group' } },
      { id: 'field', label: 'Field', title: 'Field', to: '/components/$id', params: { id: 'field' } },
      { id: 'file-trigger', label: 'FileTrigger', title: 'FileTrigger', to: '/components/$id', params: { id: 'file-trigger' } },
      { id: 'form', label: 'Form', title: 'Form', to: '/components/$id', params: { id: 'form' } },
      { id: 'list-box', label: 'ListBox', title: 'ListBox', to: '/components/$id', params: { id: 'list-box' } },
      { id: 'menu', label: 'Menu', title: 'Menu', to: '/components/$id', params: { id: 'menu' } },
      { id: 'modal', label: 'Modal', title: 'Modal', to: '/components/$id', params: { id: 'modal' } },
      { id: 'popover', label: 'Popover', title: 'Popover', to: '/components/$id', params: { id: 'popover' } },
      { id: 'radio', label: 'Radio', title: 'Radio', to: '/components/$id', params: { id: 'radio' } },
      { id: 'search-field', label: 'SearchField', title: 'SearchField', to: '/components/$id', params: { id: 'search-field' } },
      { id: 'select', label: 'Select', title: 'Select', to: '/components/$id', params: { id: 'select' } },
      { id: 'separator', label: 'Separator', title: 'Separator', to: '/components/$id', params: { id: 'separator' } },
      { id: 'sheet', label: 'Sheet', title: 'Sheet', to: '/components/$id', params: { id: 'sheet' } },
      { id: 'switch', label: 'Switch', title: 'Switch', to: '/components/$id', params: { id: 'switch' } },
      { id: 'tabs', label: 'Tabs', title: 'Tabs', to: '/components/$id', params: { id: 'tabs' } },
      { id: 'text-field', label: 'TextField', title: 'TextField', to: '/components/$id', params: { id: 'text-field' } },
      { id: 'toast', label: 'Toast', title: 'Toast', to: '/components/$id', params: { id: 'toast' } },
      { id: 'toggle-button', label: 'ToggleButton', title: 'ToggleButton', to: '/components/$id', params: { id: 'toggle-button' } },
      { id: 'tree', label: 'Tree', title: 'Tree', to: '/components/$id', params: { id: 'tree' } },
      { id: 'components-playground', label: 'Playground', title: 'Playground', to: '/components/playground' }
    ]
  }
]

export const flatNavItems: NavItem[] = navSections.flatMap((section) => section.items)

export interface DocSiblings {
  prev: NavItem | null
  next: NavItem | null
}

export function getDocSiblings(currentIdOrPath?: string): DocSiblings {
  if (!currentIdOrPath) return { prev: null, next: null }

  const normalized = currentIdOrPath.replace(/\/$/, '') || '/'

  const index = flatNavItems.findIndex((item) => {
    if (item.id === currentIdOrPath) return true
    if (item.params?.id === currentIdOrPath) return true
    if (item.to === currentIdOrPath) return true

    const path = item.params?.id
      ? item.to.replace('$id', item.params.id)
      : item.to
    return path === currentIdOrPath || path === normalized
  })

  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? flatNavItems[index - 1] : null,
    next: index < flatNavItems.length - 1 ? flatNavItems[index + 1] : null
  }
}
