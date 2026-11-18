import { type ReactNode } from 'react'
import {
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
import { cva, type VariantProps } from 'class-variance-authority'
import {
  cn,
  collectionHeaderClasses,
  collectionItemVariants,
  collectionSectionClasses,
  collectionSeparatorClasses,
  composeTailwindRenderProps,
  listBoxClasses
} from '../../utils/index.ts'

export const listBoxVariants = cva(listBoxClasses, {
  variants: {
    surface: {
      plain: '',
      bordered: 'bg-layer-1 border border-border-default rounded-sm shadow-elevation-sm'
    }
  },
  defaultVariants: {
    surface: 'plain'
  }
})

export interface ListBoxProps<T extends object = object>
  extends AriaListBoxProps<T>,
  VariantProps<typeof listBoxVariants> {
  className?: AriaListBoxProps<T>['className']
}

export function ListBox<T extends object = object>({
  surface = 'plain',
  className,
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      className={composeTailwindRenderProps(className, listBoxVariants({ surface }))}
      {...props}
    >
      {children}
    </AriaListBox>
  )
}

export interface ListBoxItemProps<T extends object = object> extends AriaListBoxItemProps<T> {
  className?: string
  children?: ReactNode | AriaListBoxItemProps<T>['children']
}

export function ListBoxItem<T extends object = object>({
  className,
  children,
  ...props
}: ListBoxItemProps<T>) {
  return (
    <AriaListBoxItem
      className={composeTailwindRenderProps(className, collectionItemVariants())}
      {...props}
    >
      {(renderProps) => (
        <>
          <span className="truncate">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
          {renderProps.isSelected && (
            <RiCheckLine className="w-icon-xs h-icon-xs text-primary shrink-0 ml-auto" aria-hidden="true" />
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
    <AriaListBoxSection className={cn(collectionSectionClasses, className)} {...props}>
      {children}
    </AriaListBoxSection>
  )
}

export function ListBoxHeader({ className, children, ...props }: AriaHeaderProps) {
  return (
    <AriaHeader className={cn(collectionHeaderClasses, className)} {...props}>
      {children}
    </AriaHeader>
  )
}

export function ListBoxSeparator({ className, ...props }: AriaSeparatorProps) {
  return (
    <AriaSeparator className={cn(collectionSeparatorClasses, className)} {...props} />
  )
}

export default ListBox
