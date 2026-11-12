export const navSections = [
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
      { id: 'components', label: 'Playground', title: 'Playground', to: '/components' }
    ]
  }
]

export const flatNavItems = navSections.flatMap((section) => section.items)

export function getDocSiblings(currentIdOrPath) {
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
