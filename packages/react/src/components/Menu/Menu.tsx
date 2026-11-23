import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Header as AriaHeader,
  type HeaderProps as AriaHeaderProps,
  Keyboard as AriaKeyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type PopoverProps as AriaPopoverProps,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react'
import { Button } from '../Button/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export type MenuItemTone = 'default' | 'danger'

export interface MenuItemProps extends Omit<AriaMenuItemProps, 'children'> {
  tone?: MenuItemTone
  icon?: ReactNode
  shortcut?: string
  children?: ReactNode | AriaMenuItemProps['children']
}

export function MenuItem({
  tone = 'default',
  icon,
  shortcut,
  className,
  children,
  ...props
}: MenuItemProps) {
  return (
    <AriaMenuItem
      data-tone={tone}
      className={composeRenderProps(className, (cn) => clsx('pd-collection-item', cn))}
      {...props}
    >
      {(renderProps) => (
        <>
          <span className="pd-menu-item-content">
            {icon && (
              <span className="pd-menu-item-icon" aria-hidden="true">
                {icon}
              </span>
            )}
            <span className="pd-collection-item-label">
              {typeof children === 'function' ? children(renderProps) : children}
            </span>
          </span>
          {shortcut && (
            <AriaKeyboard className="pd-menu-shortcut">
              {shortcut}
            </AriaKeyboard>
          )}
          {renderProps.isSelected && (
            <RiCheckLine className="pd-collection-item-check" aria-hidden="true" />
          )}
        </>
      )}
    </AriaMenuItem>
  )
}

export function MenuSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator
      className={clsx('pd-collection-separator', className)}
      {...props}
    />
  )
}

export function MenuHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader
      className={clsx('pd-collection-header', className)}
      {...props}
    >
      {children}
    </AriaHeader>
  )
}

export function MenuSection<T extends object>({ className, children, ...props }: AriaMenuSectionProps<T>) {
  return (
    <AriaMenuSection
      className={clsx('pd-collection-section', className)}
      {...props}
    >
      {children}
    </AriaMenuSection>
  )
}

export function MenuList<T extends object>({ className, children, ...props }: AriaMenuProps<T>) {
  return (
    <AriaMenu
      className={composeRenderProps(className, (cn) => clsx('pd-menu', cn))}
      {...props}
    >
      {children}
    </AriaMenu>
  )
}

export function MenuPopover({ children, ...props }: AriaPopoverProps) {
  return (
    <PopoverContent {...props}>
      {children}
    </PopoverContent>
  )
}

export const MenuTrigger = AriaMenuTrigger

export interface MenuItemData {
  type?: 'item' | 'separator' | 'group'
  id?: string
  label?: string
  icon?: ReactNode
  tone?: MenuItemTone
  shortcut?: string
  disabled?: boolean
  onClick?: () => void
  items?: MenuItemData[]
}

export interface MenuProps extends Omit<AriaMenuTriggerProps, 'children' | 'trigger'> {
  trigger?: ReactNode
  triggerType?: AriaMenuTriggerProps['trigger']
  triggerLabel?: string
  items?: MenuItemData[]
  placement?: AriaPopoverProps['placement']
  offset?: number
  className?: string
  children?: ReactNode
}

export function Menu({
  trigger,
  triggerType,
  triggerLabel = 'Actions',
  items,
  placement = 'bottom start',
  offset = 6,
  children,
  ...props
}: MenuProps) {
  if (items) {
    return (
      <AriaMenuTrigger trigger={triggerType} {...props}>
        {trigger ?? (
          <Button variant="secondary" size="md">
            <span>{triggerLabel}</span>
            <RiArrowDownSLine className="pd-menu-trigger-icon" aria-hidden="true" />
          </Button>
        )}

        <PopoverContent placement={placement} offset={offset}>
          <AriaMenu className="pd-menu">
            {items.map((item, idx) => {
              if (item.type === 'separator') {
                return <MenuSeparator key={`sep-${idx}`} />
              }

              if (item.type === 'group') {
                return (
                  <MenuSection key={`group-${idx}`}>
                    {item.label && <MenuHeader>{item.label}</MenuHeader>}
                    {item.items?.map((subItem) => {
                      const subKey = subItem.id ?? subItem.label
                      return (
                        <MenuItem
                          key={subKey}
                          id={subKey}
                          icon={subItem.icon}
                          isDisabled={subItem.disabled}
                          tone={subItem.tone}
                          shortcut={subItem.shortcut}
                          onAction={subItem.onClick}
                        >
                          {subItem.label}
                        </MenuItem>
                      )
                    })}
                  </MenuSection>
                )
              }

              const itemKey = item.id ?? item.label
              return (
                <MenuItem
                  key={itemKey}
                  id={itemKey}
                  icon={item.icon}
                  isDisabled={item.disabled}
                  tone={item.tone}
                  shortcut={item.shortcut}
                  onAction={item.onClick}
                >
                  {item.label}
                </MenuItem>
              )
            })}
          </AriaMenu>
        </PopoverContent>
      </AriaMenuTrigger>
    )
  }

  return (
    <AriaMenuTrigger trigger={triggerType} {...props}>
      {trigger}
      {children}
    </AriaMenuTrigger>
  )
}

export default Menu
