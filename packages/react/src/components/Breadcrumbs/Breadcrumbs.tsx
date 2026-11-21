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
import { RiArrowRightSLine } from '@remixicon/react'

export type BreadcrumbsSize = 'sm' | 'md' | 'lg'

export interface BreadcrumbSeparatorProps {
  className?: string
  children?: ReactNode
}

export function BreadcrumbSeparator({ className, children }: BreadcrumbSeparatorProps) {
  return (
    <span
      className={clsx('pd-breadcrumb-separator', className)}
      aria-hidden="true"
    >
      {children ?? <RiArrowRightSLine className="pd-breadcrumb-separator-icon" />}
    </span>
  )
}

export interface BreadcrumbLinkProps extends Omit<AriaLinkProps, 'children'> {
  children?: ReactNode
}

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  return (
    <AriaLink
      className={composeRenderProps(className, (cn) => clsx('pd-reset', 'pd-breadcrumb-link', cn))}
      {...props}
    >
      {children}
    </AriaLink>
  )
}

export interface BreadcrumbProps extends Omit<AriaBreadcrumbProps, 'children'> {
  separator?: ReactNode | boolean
  children?: ReactNode | ((renderProps: AriaBreadcrumbRenderProps) => ReactNode)
}

export function Breadcrumb({
  separator = true,
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
            typeof separator === 'boolean' ? <BreadcrumbSeparator /> : separator
          )}
        </>
      )}
    </AriaBreadcrumb>
  )
}

export interface BreadcrumbItemData {
  id?: Key
  label: ReactNode
  href?: string
  isDisabled?: boolean
}

export interface BreadcrumbsProps<T extends object = object>
  extends Omit<AriaBreadcrumbsProps<T>, 'children' | 'items'> {
  size?: BreadcrumbsSize
  items?: BreadcrumbItemData[]
  className?: string
  children?: ReactNode | ((item: T) => ReactNode)
}

export function Breadcrumbs<T extends object = object>({
  size = 'md',
  items,
  className,
  children,
  ...props
}: BreadcrumbsProps<T>) {
  return (
    <AriaBreadcrumbs
      data-size={size}
      className={clsx('pd-breadcrumbs', className)}
      {...props}
    >
      {items
        ? items.map((item, idx) => (
          <Breadcrumb key={item.id ?? idx} id={item.id}>
            <BreadcrumbLink href={item.href} isDisabled={item.isDisabled}>
              {item.label}
            </BreadcrumbLink>
          </Breadcrumb>
        ))
        : (children as ReactNode)}
    </AriaBreadcrumbs>
  )
}

export default Breadcrumbs
