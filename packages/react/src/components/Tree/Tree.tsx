import { type CSSProperties, type ReactNode } from 'react'
import {
  Button as AriaButton,
  Collection as AriaCollection,
  Tree as AriaTree,
  TreeHeader as AriaTreeHeader,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps as AriaTreeItemContentProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps as AriaTreeProps,
  TreeSection as AriaTreeSection
} from 'react-aria-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { composeTailwindRenderProps, focusRingInset } from '../../utils/index.ts'
import { Checkbox } from '../Checkbox/index.ts'

export const treeClasses = [
  'relative flex flex-col gap-3xs p-2xs rounded-sm bg-layer-1 border border-border-default',
  'outline-none select-none overflow-auto',
  'data-[empty]:p-md data-[empty]:text-body-sm data-[empty]:text-on-surface-muted data-[empty]:text-center',
  focusRingInset
].join(' ')

export const treeItemClasses = [
  'group relative flex items-center gap-xs h-control-sm pr-xs rounded-xs',
  'text-label-sm text-on-surface select-none cursor-pointer',
  focusRingInset,
  'hover:bg-layer-2-hover data-[hovered]:bg-layer-2-hover data-[focused]:bg-layer-2-hover',
  'data-[selected]:bg-layer-1-selected data-[selected]:hover:bg-layer-1-selected-hover data-[selected]:font-medium',
  'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

export interface TreeProps<T extends object = object> extends AriaTreeProps<T> {
  className?: string
}

export function Tree<T extends object = object>({ className, children, ...props }: TreeProps<T>) {
  return (
    <AriaTree
      className={composeTailwindRenderProps(className, treeClasses)}
      {...props}
    >
      {children}
    </AriaTree>
  )
}

export interface TreeItemProps<T extends object = object> extends AriaTreeItemProps<T> {
  className?: string
  children: ReactNode
}

export function TreeItem<T extends object = object>({
  className,
  style,
  children,
  ...props
}: TreeItemProps<T>) {
  return (
    <AriaTreeItem
      className={composeTailwindRenderProps(className, treeItemClasses)}
      style={(renderProps): CSSProperties => ({
        ...renderProps.defaultStyle,
        paddingInlineStart: `calc(${(renderProps.level - 1) * 1}rem + 0.5rem)`,
        ...(typeof style === 'function' ? style(renderProps) : style)
      })}
      {...props}
    >
      {children}
    </AriaTreeItem>
  )
}

export interface TreeItemContentProps extends Omit<AriaTreeItemContentProps, 'children'> {
  children: ReactNode | AriaTreeItemContentProps['children']
}

export function TreeItemContent({ children, ...props }: TreeItemContentProps) {
  return (
    <AriaTreeItemContent {...props}>
      {(renderProps) => (
        <div className="flex items-center gap-xs flex-1 min-w-0">
          {renderProps.selectionMode === 'multiple' && (
            <Checkbox slot="selection" />
          )}

          {renderProps.hasChildItems ? (
            <AriaButton
              slot="chevron"
              className="inline-flex items-center justify-center w-control-xs h-control-xs -ml-2xs rounded-2xs text-on-surface-muted hover:text-on-surface hover:bg-hover cursor-pointer outline-none shrink-0"
            >
              <RiArrowRightSLine
                className={`w-icon-xs h-icon-xs transition-transform duration-fast ease-default ${
                  renderProps.isExpanded ? 'rotate-90' : ''
                }`}
                aria-hidden="true"
              />
            </AriaButton>
          ) : (
            <span className="w-control-xs -ml-2xs shrink-0" aria-hidden="true" />
          )}

          <span className="flex-1 min-w-0 truncate">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
        </div>
      )}
    </AriaTreeItemContent>
  )
}

export const TreeCollection = AriaCollection
export const TreeSection = AriaTreeSection
export const TreeHeader = AriaTreeHeader

export default Tree
