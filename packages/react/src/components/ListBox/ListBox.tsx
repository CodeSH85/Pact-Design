import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  composeRenderProps,
  Header as AriaHeader,
  type HeaderProps as AriaHeaderProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps
} from 'react-aria-components'
import { RiCheckLine } from '@remixicon/react'

export type ListBoxSurface = 'plain' | 'bordered'

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
      data-surface={surface}
      className={composeRenderProps(className, (cn) => clsx('pd-listbox', cn))}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export interface ListBoxItemProps<T extends object = object> extends Omit<AriaListBoxItemProps<T>, 'children'> {
  children?: ReactNode | AriaListBoxItemProps<T>['children']
}

export function ListBoxItem<T extends object = object>({
  className,
  children,
  ...props
}: ListBoxItemProps<T>) {
  return (
    <AriaListBoxItem
      className={composeRenderProps(className, (cn) => clsx('pd-collection-item', cn))}
      {...props}
    >
      {(renderProps) => (
        <>
          <span className="pd-collection-item-label">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
          {renderProps.isSelected && (
            <RiCheckLine className="pd-collection-item-check" aria-hidden="true" />
          )}
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

export function ListBoxSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator className={clsx('pd-collection-separator', className)} {...props} />
  )
}

export default ListBox
