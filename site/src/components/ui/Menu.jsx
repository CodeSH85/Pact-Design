import { Menu as BaseMenu } from '@base-ui/react/menu'

export function Menu({
  triggerLabel = 'Actions',
  items = [],
  align = 'start',
  sideOffset = 6
}) {
  const triggerClasses = [
    'inline-flex items-center justify-center select-none cursor-pointer',
    'h-control-md px-md gap-xs rounded-sm',
    'bg-layer-1 text-on-surface text-label-md border border-border-default',
    'transition-colors duration-fast ease-default',
    'hover:bg-layer-1-hover active:bg-layer-1-active',
    'data-[popup-open]:bg-layer-1-selected data-[popup-open]:border-border-strong',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2'
  ].join(' ')

  const popupClasses = [
    'min-w-48 p-2xs rounded-md',
    'bg-elevated text-on-surface border border-border-default shadow-elevation-lg',
    'outline-none origin-top transition-opacity duration-fast ease-default'
  ].join(' ')

  const itemClasses = [
    'flex items-center justify-between gap-md',
    'h-control-sm px-sm rounded-xs',
    'text-label-sm text-on-surface select-none cursor-pointer outline-none',
    'data-[highlighted]:bg-layer-2-hover',
    'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
  ].join(' ')

  const dangerItemClasses = [
    'flex items-center justify-between gap-md',
    'h-control-sm px-sm rounded-xs',
    'text-label-sm text-on-danger-subtle select-none cursor-pointer outline-none',
    'data-[highlighted]:bg-danger-subtle',
    'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
  ].join(' ')

  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger className={triggerClasses}>
        <span>{triggerLabel}</span>
        <span className="text-caption-sm text-on-surface-muted" aria-hidden="true">▾</span>
      </BaseMenu.Trigger>

      <BaseMenu.Portal>
        <BaseMenu.Positioner className="z-dropdown outline-none" sideOffset={sideOffset} align={align}>
          <BaseMenu.Popup className={popupClasses}>
            {items.map((item, idx) => {
              if (item.type === 'separator') {
                return (
                  <BaseMenu.Separator
                    key={`sep-${idx}`}
                    className="my-2xs h-px bg-border-subtle"
                  />
                )
              }

              if (item.type === 'group') {
                return (
                  <BaseMenu.Group key={`group-${idx}`}>
                    {item.label && (
                      <BaseMenu.GroupLabel className="px-sm py-2xs text-caption-sm text-on-surface-muted select-none">
                        {item.label}
                      </BaseMenu.GroupLabel>
                    )}
                    {item.items.map((subItem) => (
                      <BaseMenu.Item
                        key={subItem.label}
                        disabled={subItem.disabled}
                        onClick={subItem.onClick}
                        className={subItem.tone === 'danger' ? dangerItemClasses : itemClasses}
                      >
                        <span>{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="text-mono-xs text-on-surface-muted">{subItem.shortcut}</span>
                        )}
                      </BaseMenu.Item>
                    ))}
                  </BaseMenu.Group>
                )
              }

              return (
                <BaseMenu.Item
                  key={item.label}
                  disabled={item.disabled}
                  onClick={item.onClick}
                  className={item.tone === 'danger' ? dangerItemClasses : itemClasses}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="text-mono-xs text-on-surface-muted">{item.shortcut}</span>
                  )}
                </BaseMenu.Item>
              )
            })}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  )
}
