import {
  Button as AriaButton,
  Header,
  Menu as AriaMenu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator
} from 'react-aria-components'

export function Menu({
  triggerLabel = 'Actions',
  items = [],
  placement = 'bottom start',
  offset = 6
}) {
  const triggerClasses = [
    'inline-flex items-center justify-center select-none cursor-pointer outline-none',
    'h-control-md px-md gap-xs rounded-sm',
    'bg-layer-1 text-on-surface text-label-md border border-border-default',
    'transition-colors duration-fast ease-default',
    'hover:bg-layer-1-hover data-[hovered]:bg-layer-1-hover',
    'active:bg-layer-1-active data-[pressed]:bg-layer-1-selected data-[pressed]:border-border-strong',
    'data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-border-focus data-[focus-visible]:outline-offset-2'
  ].join(' ')

  const popoverClasses = [
    'z-dropdown min-w-48 p-2xs rounded-md',
    'bg-elevated text-on-surface border border-border-default shadow-elevation-lg',
    'outline-none origin-top transition-opacity duration-fast ease-default'
  ].join(' ')

  const itemClasses = [
    'flex items-center justify-between gap-md',
    'h-control-sm px-sm rounded-xs',
    'text-label-sm text-on-surface select-none cursor-pointer outline-none',
    'data-[focused]:bg-layer-2-hover data-[hovered]:bg-layer-2-hover',
    'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
  ].join(' ')

  const dangerItemClasses = [
    'flex items-center justify-between gap-md',
    'h-control-sm px-sm rounded-xs',
    'text-label-sm text-on-danger-subtle select-none cursor-pointer outline-none',
    'data-[focused]:bg-danger-subtle data-[hovered]:bg-danger-subtle',
    'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
  ].join(' ')

  return (
    <MenuTrigger>
      <AriaButton className={triggerClasses}>
        <span>{triggerLabel}</span>
        <span className="text-caption-sm text-on-surface-muted" aria-hidden="true">▾</span>
      </AriaButton>

      <Popover placement={placement} offset={offset} className={popoverClasses}>
        <AriaMenu className="outline-none">
          {items.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <Separator
                  key={`sep-${idx}`}
                  className="my-2xs h-px bg-border-subtle border-0"
                />
              )
            }

            if (item.type === 'group') {
              return (
                <MenuSection key={`group-${idx}`}>
                  {item.label && (
                    <Header className="px-sm py-2xs text-caption-sm text-on-surface-muted select-none">
                      {item.label}
                    </Header>
                  )}
                  {item.items.map((subItem) => (
                    <MenuItem
                      key={subItem.label}
                      id={subItem.label}
                      isDisabled={subItem.disabled}
                      onAction={subItem.onClick}
                      className={subItem.tone === 'danger' ? dangerItemClasses : itemClasses}
                    >
                      <span>{subItem.label}</span>
                      {subItem.shortcut && (
                        <span className="text-mono-xs text-on-surface-muted">{subItem.shortcut}</span>
                      )}
                    </MenuItem>
                  ))}
                </MenuSection>
              )
            }

            return (
              <MenuItem
                key={item.label}
                id={item.label}
                isDisabled={item.disabled}
                onAction={item.onClick}
                className={item.tone === 'danger' ? dangerItemClasses : itemClasses}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-mono-xs text-on-surface-muted">{item.shortcut}</span>
                )}
              </MenuItem>
            )
          })}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  )
}

export default Menu
