export type NavItem =
  | {
    id: string
    label: string
    title: string
    to: '/' | '/principles' | '/components/playground'
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
    title: '開始',
    items: [
      { id: 'introduction', label: '關於 Pact Design', title: '關於 Pact Design', to: '/' },
      { id: 'principles', label: '設計原則', title: '設計原則', to: '/principles' }
    ]
  },
  {
    title: '設計基礎',
    items: [
      { id: 'color', label: '色彩', title: '色彩', to: '/foundations/$id', params: { id: 'color' } },
      { id: 'typography', label: '字體', title: '字體', to: '/foundations/$id', params: { id: 'typography' } },
      { id: 'spacing', label: '間距', title: '間距', to: '/foundations/$id', params: { id: 'spacing' } },
      { id: 'sizing', label: '尺寸', title: '尺寸', to: '/foundations/$id', params: { id: 'sizing' } },
      { id: 'elevation', label: '陰影', title: '陰影', to: '/foundations/$id', params: { id: 'elevation' } },
      { id: 'motion', label: '動態', title: '動態', to: '/foundations/$id', params: { id: 'motion' } },
      { id: 'design-token', label: 'Design Token', title: 'Design Token', to: '/foundations/$id', params: { id: 'design-token' } }
    ]
  },
  {
    title: '元件',
    items: [
      { id: 'autocomplete', label: 'Autocomplete 自動完成', title: 'Autocomplete 自動完成', to: '/components/$id', params: { id: 'autocomplete' } },
      { id: 'badge', label: 'Badge 徽章', title: 'Badge 徽章', to: '/components/$id', params: { id: 'badge' } },
      { id: 'breadcrumbs', label: 'Breadcrumbs 麵包屑', title: 'Breadcrumbs 麵包屑', to: '/components/$id', params: { id: 'breadcrumbs' } },
      { id: 'button', label: 'Button 按鈕', title: 'Button 按鈕', to: '/components/$id', params: { id: 'button' } },
      { id: 'calendar', label: 'Calendar 行事曆', title: 'Calendar 行事曆', to: '/components/$id', params: { id: 'calendar' } },
      { id: 'checkbox', label: 'Checkbox 核取方塊', title: 'Checkbox 核取方塊', to: '/components/$id', params: { id: 'checkbox' } },
      { id: 'combobox', label: 'ComboBox 組合方塊', title: 'ComboBox 組合方塊', to: '/components/$id', params: { id: 'combobox' } },
      { id: 'date-field', label: 'DateField 日期欄位', title: 'DateField 日期欄位', to: '/components/$id', params: { id: 'date-field' } },
      { id: 'date-picker', label: 'DatePicker 日期選擇器', title: 'DatePicker 日期選擇器', to: '/components/$id', params: { id: 'date-picker' } },
      { id: 'disclosure', label: 'Disclosure 折疊面板', title: 'Disclosure 折疊面板', to: '/components/$id', params: { id: 'disclosure' } },
      { id: 'disclosure-group', label: 'DisclosureGroup 折疊面板群組', title: 'DisclosureGroup 折疊面板群組', to: '/components/$id', params: { id: 'disclosure-group' } },
      { id: 'field', label: 'Field 表單欄位', title: 'Field 表單欄位', to: '/components/$id', params: { id: 'field' } },
      { id: 'file-trigger', label: 'FileTrigger 檔案選擇', title: 'FileTrigger 檔案選擇', to: '/components/$id', params: { id: 'file-trigger' } },
      { id: 'form', label: 'Form 表單', title: 'Form 表單', to: '/components/$id', params: { id: 'form' } },
      { id: 'list-box', label: 'ListBox 選項清單', title: 'ListBox 選項清單', to: '/components/$id', params: { id: 'list-box' } },
      { id: 'menu', label: 'Menu 選單', title: 'Menu 選單', to: '/components/$id', params: { id: 'menu' } },
      { id: 'modal', label: 'Modal 互動視窗', title: 'Modal 互動視窗', to: '/components/$id', params: { id: 'modal' } },
      { id: 'popover', label: 'Popover 浮動視窗', title: 'Popover 浮動視窗', to: '/components/$id', params: { id: 'popover' } },
      { id: 'radio', label: 'Radio 單選按鈕', title: 'Radio 單選按鈕', to: '/components/$id', params: { id: 'radio' } },
      { id: 'search-field', label: 'SearchField 搜尋欄位', title: 'SearchField 搜尋欄位', to: '/components/$id', params: { id: 'search-field' } },
      { id: 'select', label: 'Select 下拉選單', title: 'Select 下拉選單', to: '/components/$id', params: { id: 'select' } },
      { id: 'separator', label: 'Separator 分隔線', title: 'Separator 分隔線', to: '/components/$id', params: { id: 'separator' } },
      { id: 'sheet', label: 'Sheet 側邊抽屜', title: 'Sheet 側邊抽屜', to: '/components/$id', params: { id: 'sheet' } },
      { id: 'slider', label: 'Slider 滑桿', title: 'Slider 滑桿', to: '/components/$id', params: { id: 'slider' } },
      { id: 'switch', label: 'Switch 開關', title: 'Switch 開關', to: '/components/$id', params: { id: 'switch' } },
      { id: 'tabs', label: 'Tabs 頁籤', title: 'Tabs 頁籤', to: '/components/$id', params: { id: 'tabs' } },
      { id: 'text-field', label: 'TextField 文字輸入框', title: 'TextField 文字輸入框', to: '/components/$id', params: { id: 'text-field' } },
      { id: 'toast', label: 'Toast 訊息通知', title: 'Toast 訊息通知', to: '/components/$id', params: { id: 'toast' } },
      { id: 'toggle-button', label: 'ToggleButton 切換按鈕', title: 'ToggleButton 切換按鈕', to: '/components/$id', params: { id: 'toggle-button' } },
      { id: 'tooltip', label: 'Tooltip 工具提示', title: 'Tooltip 工具提示', to: '/components/$id', params: { id: 'tooltip' } },
      { id: 'tree', label: 'Tree 樹狀列表', title: 'Tree 樹狀列表', to: '/components/$id', params: { id: 'tree' } },
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
