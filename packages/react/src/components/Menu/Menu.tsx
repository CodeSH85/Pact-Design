import { type ReactNode } from 'react'
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
  type PopoverProps as AriaPopoverProps,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiArrowDownSLine } from '@remixicon/react'
import {
  cn,
  collectionHeaderClasses,
  collectionItemVariants,
  collectionSectionClasses,
  collectionSeparatorClasses,
  composeTailwindRenderProps
} from '../../utils/index.ts'
import { Button, buttonVariants } from '../Button/index.ts'
import { PopoverContent } from '../Popover/index.ts'

export const menuItemClasses = collectionItemVariants({ tone: 'default' })
export const menuDangerItemClasses = collectionItemVariants({ tone: 'danger' })
export const menuTriggerButtonClasses = buttonVariants({ variant: 'secondary', size: 'md' })

export interface MenuItemProps extends AriaMenuItemProps {
  tone?: 'default' | 'danger'
  shortcut?: string
  className?: string
  children?: ReactNode | AriaMenuItemProps['children']
}

export function MenuItem({
  tone = 'default',
  shortcut,
  className,
  children,
  ...props
}: MenuItemProps) {
  return (
    <AriaMenuItem
      className={composeTailwindRenderProps(className, collectionItemVariants({ tone }))}
      {...props}
    >
      {(renderProps) => (
        <>
          {typeof children === 'function' ? children(renderProps) : children}
          {shortcut && (
            <AriaKeyboard className="text-mono-xs text-on-surface-muted ml-auto pl-sm">
              {shortcut}
            </AriaKeyboard>
          )}
        </>
      )}
    </AriaMenuItem>
  )
}

export function MenuSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator
      className={cn(collectionSeparatorClasses, className)}
      {...props}
    />
  )
}

export function MenuHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader
      className={cn(collectionHeaderClasses, className)}
      {...props}
    >
      {children}
    </AriaHeader>
  )
}

export function MenuSection<T extends object>({ className, children, ...props }: AriaMenuSectionProps<T>) {
  return (
    <AriaMenuSection
      className={cn(collectionSectionClasses, className)}
      {...props}
    >
      {children}
    </AriaMenuSection>
  )
}

export function MenuList<T extends object>({ className, children, ...props }: AriaMenuProps<T>) {
  return (
    <AriaMenu
      className={composeTailwindRenderProps(className, 'outline-none', collectionSectionClasses)}
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
  label?: string
  tone?: 'default' | 'danger'
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
            <RiArrowDownSLine className="w-icon-xs h-icon-xs text-on-surface-muted" aria-hidden="true" />
          </Button>
        )}

        <PopoverContent placement={placement} offset={offset}>
          <AriaMenu className={cn('outline-none', collectionSectionClasses)}>
            {items.map((item, idx) => {
              if (item.type === 'separator') {
                return <MenuSeparator key={`sep-${idx}`} />
              }

              if (item.type === 'group') {
                return (
                  <MenuSection key={`group-${idx}`}>
                    {item.label && <MenuHeader>{item.label}</MenuHeader>}
                    {item.items?.map((subItem) => (
                      <MenuItem
                        key={subItem.label}
                        id={subItem.label}
                        isDisabled={subItem.disabled}
                        tone={subItem.tone}
                        shortcut={subItem.shortcut}
                        onAction={subItem.onClick}
                      >
                        {subItem.label}
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
    <AriaMenuTrigger {...props}>
      {trigger}
      {children}
    </AriaMenuTrigger>
  )
}

export default Menu
