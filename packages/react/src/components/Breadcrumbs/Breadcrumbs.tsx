import { type ReactNode } from 'react'
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  Link as AriaLink,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type BreadcrumbRenderProps as AriaBreadcrumbRenderProps,
  type LinkProps as AriaLinkProps,
  type Key
} from 'react-aria-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, composeTailwindRenderProps, focusRing } from '../../utils/index.ts'

export const breadcrumbsVariants = cva(
  'flex items-center flex-wrap list-none m-0 p-0',
  {
    variants: {
      size: {
        sm: 'text-label-xs gap-3xs',
        md: 'text-label-sm gap-2xs',
        lg: 'text-label-md gap-xs'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface BreadcrumbSeparatorProps {
  className?: string
  children?: ReactNode
}

export function BreadcrumbSeparator({ className, children }: BreadcrumbSeparatorProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-on-surface-disabled shrink-0 select-none',
        className
      )}
      aria-hidden="true"
    >
      {children ?? <RiArrowRightSLine className="w-icon-xs h-icon-xs" />}
    </span>
  )
}

export interface BreadcrumbLinkProps extends AriaLinkProps {
  className?: string
  children?: ReactNode
}

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  return (
    <AriaLink
      className={composeTailwindRenderProps(
        className,
        [
          'inline-flex items-center transition-colors duration-fast rounded-xs outline-none',
          'text-inherit text-on-surface-muted hover:text-on-surface hover:underline cursor-pointer',
          'data-[current]:text-on-surface data-[current]:font-medium data-[current]:no-underline data-[current]:cursor-default data-[current]:pointer-events-none',
          'data-[disabled]:text-on-surface-disabled data-[disabled]:cursor-not-allowed',
          focusRing
        ].join(' ')
      )}
      {...props}
    >
      {children}
    </AriaLink>
  )
}

export interface BreadcrumbProps extends AriaBreadcrumbProps {
  separator?: ReactNode | boolean
  className?: string
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
      className={composeTailwindRenderProps(className, 'inline-flex items-center gap-2xs')}
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
  extends Omit<AriaBreadcrumbsProps<T>, 'children' | 'items'>,
  VariantProps<typeof breadcrumbsVariants> {
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
      className={cn(breadcrumbsVariants({ size }), className)}
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
