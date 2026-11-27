import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Header as AriaHeader,
  type HeaderProps as AriaHeaderProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  type ListBoxSectionProps as AriaListBoxSectionProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { dataAttrs, pdClass } from '../../internal/index.ts'
import { resolveDisableableProps, type DisableableProps } from '../../utils/index.ts'
import { Separator, type SeparatorProps } from '../Separator/index.ts'

export type ListBoxSurface = 'plain' | 'bordered'

export interface ListBoxItemIcons {
  check?: IconSlot
}

export interface ListBoxProps<T extends object = object> extends AriaListBoxProps<T> {
  surface?: ListBoxSurface
}

export function ListBox<T extends object = object>({
  surface = 'plain',
  className,
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...dataAttrs({ surface })}
      className={pdClass(className, 'pd-listbox')}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export interface ListBoxItemProps<T extends object = object>
  extends Omit<AriaListBoxItemProps<T>, 'children'>,
  DisableableProps {
  icons?: ListBoxItemIcons
  children?: ReactNode | AriaListBoxItemProps<T>['children']
}

export function ListBoxItem<T extends object = object>({
  icons,
  textValue,
  className,
  children,
  ...props
}: ListBoxItemProps<T>) {
  const ariaProps = resolveDisableableProps(props)
  const resolvedTextValue = textValue ?? (
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : undefined
  )

  return (
    <AriaListBoxItem
      textValue={resolvedTextValue}
      className={pdClass(className, 'pd-collection-item')}
      {...ariaProps}
    >
      {(renderProps) => (
        <>
          <span className="pd-collection-item-label">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
          {renderProps.isSelected &&
            renderIcon(icons?.check, 'check', 'pd-collection-item-check')}
        </>
      )}
    </AriaListBoxItem>
  )
}

export function ListBoxSection<T extends object = object>({
  className,
  children,
  ...props
}: AriaListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection className={clsx('pd-collection-section', className)} {...props}>
      {children}
    </AriaListBoxSection>
  )
}

export function ListBoxHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader className={clsx('pd-collection-header', className)} {...props}>
      {children}
    </AriaHeader>
  )
}

export function ListBoxSeparator({ className, ...props }: SeparatorProps) {
  return (
    <Separator className={clsx('pd-collection-separator', className)} {...props} />
  )
}

export default ListBox
