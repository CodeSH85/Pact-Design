import { type CSSProperties, type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  composeRenderProps,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps as AriaTreeItemContentProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps as AriaTreeProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import { resolveDisableableProps, type DisableableProps } from '../../utils/index.ts'
import { Checkbox } from '../Checkbox/index.ts'

export interface TreeIcons {
  chevron?: IconSlot
}

export type TreeProps<T extends object = object> = AriaTreeProps<T>

export function Tree<T extends object = object>({ className, children, ...props }: TreeProps<T>) {
  return (
    <AriaTree
      className={composeRenderProps(className, (cn) => clsx('pd-tree', cn))}
      {...props}
    >
      {children}
    </AriaTree>
  )
}

export interface TreeItemProps<T extends object = object>
  extends Omit<AriaTreeItemProps<T>, 'children'>,
  DisableableProps {
  children: ReactNode
}

export function TreeItem<T extends object = object>({
  className,
  style,
  children,
  ...props
}: TreeItemProps<T>) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaTreeItem
      className={composeRenderProps(className, (cn) => clsx('pd-tree-item', cn))}
      style={(renderProps): CSSProperties => ({
        ...renderProps.defaultStyle,
        paddingInlineStart: `calc(${(renderProps.level - 1) * 1}rem + 0.5rem)`,
        ...(typeof style === 'function' ? style(renderProps) : style)
      })}
      {...ariaProps}
    >
      {children}
    </AriaTreeItem>
  )
}

export interface TreeItemContentProps extends Omit<AriaTreeItemContentProps, 'children'> {
  icons?: TreeIcons
  children: ReactNode | AriaTreeItemContentProps['children']
}

export function TreeItemContent({ icons, children, ...props }: TreeItemContentProps) {
  return (
    <AriaTreeItemContent {...props}>
      {(renderProps) => (
        <div className="pd-tree-item-content">
          {renderProps.selectionMode === 'multiple' && (
            <Checkbox slot="selection" />
          )}

          {renderProps.hasChildItems ? (
            <AriaButton
              slot="chevron"
              className="pd-reset pd-tree-chevron-btn"
            >
              {renderIcon(icons?.chevron, 'chevronRight', 'pd-tree-chevron-icon', {
                'data-expanded': renderProps.isExpanded ? '' : undefined
              })}
            </AriaButton>
          ) : (
            <span className="pd-tree-chevron-spacer" aria-hidden="true" />
          )}

          <span className="pd-tree-item-label">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
        </div>
      )}
    </AriaTreeItemContent>
  )
}

export {
  Collection as TreeCollection,
  TreeHeader,
  TreeSection
} from 'react-aria-components'

export default Tree
