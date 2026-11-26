import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  composeRenderProps,
  Link as AriaLink,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type BreadcrumbRenderProps as AriaBreadcrumbRenderProps,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type Key,
  type LinkProps as AriaLinkProps
} from 'react-aria-components'
import { renderIcon, type IconSlot } from '../../icons/index.ts'
import {
  resolveDisableableProps,
  resolveDisabled,
  type DisableableProps
} from '../../utils/index.ts'

export type BreadcrumbsSize = 'sm' | 'md' | 'lg'

export interface BreadcrumbsIcons {
  separator?: IconSlot
}

export interface BreadcrumbSeparatorProps {
  icons?: BreadcrumbsIcons
  className?: string
  children?: ReactNode
}

export function BreadcrumbSeparator({ icons, className, children }: BreadcrumbSeparatorProps) {
  return (
    <span
      className={clsx('pd-breadcrumb-separator', className)}
      aria-hidden="true"
    >
      {children ?? renderIcon(icons?.separator, 'chevronRight', 'pd-breadcrumb-separator-icon')}
    </span>
  )
}

export interface BreadcrumbLinkProps
  extends Omit<AriaLinkProps, 'children'>,
  DisableableProps {
  children?: ReactNode
}

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaLink
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-breadcrumb-link', cn))}
      {...ariaProps}
    >
      {children}
    </AriaLink>
  )
}

export interface BreadcrumbProps extends Omit<AriaBreadcrumbProps, 'children'> {
  separator?: IconSlot | boolean
  icons?: BreadcrumbsIcons
  children?: ReactNode | ((renderProps: AriaBreadcrumbRenderProps) => ReactNode)
}

export function Breadcrumb({
  separator = true,
  icons,
  className,
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <AriaBreadcrumb
      className={composeRenderProps(className, (cn) => clsx('pd-breadcrumb', cn))}
      {...props}
    >
      {(renderProps) => (
        <>
          {typeof children === 'function' ? children(renderProps) : children}
          {separator && !renderProps.isCurrent && (
            typeof separator === 'boolean'
              ? <BreadcrumbSeparator icons={icons} />
              : <BreadcrumbSeparator icons={{ separator }} />
          )}
        </>
      )}
    </AriaBreadcrumb>
  )
}

export interface BreadcrumbItemData extends DisableableProps {
  id?: Key
  label: ReactNode
  href?: string
}

export interface BreadcrumbsProps<T extends object = object>
  extends Omit<AriaBreadcrumbsProps<T>, 'children' | 'items'>,
  DisableableProps {
  size?: BreadcrumbsSize
  items?: BreadcrumbItemData[]
  separator?: IconSlot | boolean
  icons?: BreadcrumbsIcons
  className?: string
  children?: ReactNode | ((item: T) => ReactNode)
}

export function Breadcrumbs<T extends object = object>({
  size = 'md',
  items,
  separator = true,
  icons,
  className,
  children,
  ...props
}: BreadcrumbsProps<T>) {
  const ariaProps = resolveDisableableProps(props)

  return (
    <AriaBreadcrumbs
      data-size={size}
      className={clsx('pd-breadcrumbs', className)}
      {...ariaProps}
    >
      {items
        ? items.map((item, idx) => (
          <Breadcrumb
            key={item.id ?? idx}
            id={item.id}
            separator={separator}
            icons={icons}
          >
            <BreadcrumbLink href={item.href} isDisabled={resolveDisabled(item)}>
              {item.label}
            </BreadcrumbLink>
          </Breadcrumb>
        ))
        : (children as ReactNode)}
    </AriaBreadcrumbs>
  )
}

export default Breadcrumbs
