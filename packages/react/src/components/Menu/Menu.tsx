import { type ReactNode } from 'react'
import {
  Button as AriaButton,
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
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiArrowDownSLine } from '@remixicon/react'
import { cn, composeTailwindRenderProps, focusRing, focusRingInset } from '../../utils/index.ts'
import { popoverContentClasses } from '../Popover/index.ts'

export const menuItemClasses = [
  'flex items-center justify-between gap-md',
  'h-control-sm px-sm rounded-xs',
  'text-label-sm text-on-surface select-none cursor-pointer',
  focusRingInset,
  'data-[focused]:bg-layer-2-hover data-[hovered]:bg-layer-2-hover',
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

export const menuDangerItemClasses = [
  'flex items-center justify-between gap-md',
  'h-control-sm px-sm rounded-xs',
  'text-label-sm text-on-danger-subtle select-none cursor-pointer',
  focusRingInset,
  'data-[focused]:bg-danger-subtle data-[hovered]:bg-danger-subtle',
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

export const menuTriggerButtonClasses = [
  'inline-flex items-center justify-center select-none cursor-pointer',
  'h-control-md px-md gap-xs rounded-sm',
  'bg-layer-1 text-on-surface text-label-md border border-border-default',
  'transition-colors duration-fast ease-default',
  'hover:bg-layer-1-hover data-[hovered]:bg-layer-1-hover',
  'active:bg-layer-1-active data-[pressed]:bg-layer-1-selected data-[pressed]:border-border-strong',
  focusRing
].join(' ')

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
  const baseClasses = tone === 'danger' ? menuDangerItemClasses : menuItemClasses

  return (
    <AriaMenuItem
      className={composeTailwindRenderProps(className, baseClasses)}
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
      className={cn('my-2xs h-px bg-border-subtle border-0', className)}
      {...props}
    />
  )
}

export function MenuHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader
      className={cn(
        'px-sm py-2xs text-caption-sm font-medium text-on-surface-muted select-none',
        className
      )}
      {...props}
    >
      {children}
    </AriaHeader>
  )
}

export function MenuSection<T extends object>({ className, children, ...props }: AriaMenuSectionProps<T>) {
  return (
    <AriaMenuSection
      className={cn('flex flex-col gap-3xs', className)}
      {...props}
    >
      {children}
    </AriaMenuSection>
  )
}

export function MenuList<T extends object>({ className, children, ...props }: AriaMenuProps<T>) {
  return (
    <AriaMenu
      className={composeTailwindRenderProps(className, 'outline-none flex flex-col gap-3xs')}
      {...props}
    >
      {children}
    </AriaMenu>
  )
}

export function MenuPopover({ className, children, ...props }: AriaPopoverProps) {
  return (
    <AriaPopover
      offset={6}
      className={composeTailwindRenderProps(className, popoverContentClasses)}
      {...props}
    >
      {children}
    </AriaPopover>
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
          <AriaButton className={menuTriggerButtonClasses}>
            <span>{triggerLabel}</span>
            <RiArrowDownSLine className="w-icon-xs h-icon-xs text-on-surface-muted" aria-hidden="true" />
          </AriaButton>
        )}

        <AriaPopover placement={placement} offset={offset} className={popoverContentClasses}>
          <AriaMenu className="outline-none flex flex-col gap-3xs">
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
        </AriaPopover>
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
