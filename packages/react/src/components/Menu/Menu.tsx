import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
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
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import {
  resolveDisableableProps,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'
import { Button } from '../Button/index.ts'
import { PopoverContent } from '../Popover/index.ts'
import { Separator, type SeparatorProps } from '../Separator/index.ts'

export type MenuItemTone = 'default' | 'danger'

export interface MenuIcons {
  chevron?: IconSlot
  check?: IconSlot
}

export interface MenuItemProps
  extends Omit<AriaMenuItemProps, 'children'>,
  DisableableProps {
  tone?: MenuItemTone
  icon?: ReactNode
  icons?: Pick<MenuIcons, 'check'>
  shortcut?: string
  children?: ReactNode | AriaMenuItemProps['children']
}

export function MenuItem({
  tone = 'default',
  icon,
  icons,
  shortcut,
  textValue,
  className,
  children,
  ...props
}: MenuItemProps) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedTextValue = textValue ?? (
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : undefined
  )

  return (
    <AriaMenuItem
      {...dataAttrs({ tone })}
      textValue={resolvedTextValue}
      className={pdClass(className, 'pd-collection-item')}
      {...ariaProps}
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
          {renderProps.isSelected &&
            renderIcon(icons?.check, 'check', 'pd-collection-item-check')}
        </>
      )}
    </AriaMenuItem>
  )
}

export function MenuSeparator({ className, ...props }: SeparatorProps) {
  return (
    <Separator
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
      className={pdClass(className, 'pd-menu')}
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

export interface MenuItemData extends DisableableProps {
  type?: 'item' | 'separator' | 'group'
  id?: string
  label?: string
  icon?: ReactNode
  tone?: MenuItemTone
  shortcut?: string
  onClick?: () => void
  items?: MenuItemData[]
}

export interface MenuProps
  extends Omit<AriaMenuTriggerProps, 'children' | 'trigger'>,
  Pick<
    AriaMenuProps<object>,
    'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange' | 'disallowEmptySelection' | 'onAction'
  >,
  DisableableProps {
  trigger?: ReactNode
  triggerType?: AriaMenuTriggerProps['trigger']
  triggerLabel?: string
  items?: MenuItemData[]
  icons?: MenuIcons
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
  icons,
  placement = 'bottom start',
  offset = 6,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disallowEmptySelection,
  onAction,
  disabled,
  isDisabled,
  children,
  ...props
}: MenuProps) {
  const resolvedDisabled = resolveDisabled({ disabled, isDisabled })

  if (items) {
    return (
      <AriaMenuTrigger trigger={triggerType} {...props}>
        {trigger ?? (
          <Button variant="secondary" size="md" isDisabled={resolvedDisabled}>
            <span>{triggerLabel}</span>
            {renderIcon(icons?.chevron, 'chevronDown', 'pd-menu-trigger-icon')}
          </Button>
        )}

        <PopoverContent placement={placement} offset={offset}>
          <AriaMenu
            className="pd-menu"
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onSelectionChange={onSelectionChange}
            disallowEmptySelection={disallowEmptySelection}
            onAction={onAction}
          >
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
                          icons={icons}
                          isDisabled={resolveDisabled(subItem)}
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
                  icons={icons}
                  isDisabled={resolveDisabled(item)}
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
