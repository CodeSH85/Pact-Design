import type { ComponentPropsWithoutRef } from 'react'
import type { useMDXComponents } from '@mdx-js/react'
import { ColorPalette } from '../demos/ColorPalette'

export const mdxComponents: ReturnType<typeof useMDXComponents> = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="my-sm text-heading-xs text-on-surface-default scroll-mt-xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-sm text-subheader-md text-on-surface scroll-mt-xl" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-body-md text-on-surface-secondary" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="text-on-surface text-body-md" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-primary hover:text-primary-hover hover:underline" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc pl-xl flex flex-col gap-xs text-body-md text-on-surface-secondary" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="m-0 pl-xl flex flex-col gap-xs text-body-md text-on-surface-default list-decimal" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-07 text-body-md" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="border-0 border-t border-border-default my-xs" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="m-0 py-sm px-md border-l-lg border-primary bg-layer-2 rounded-r-xs text-on-surface-secondary"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="text-mono-sm px-2xs py-1px rounded-2xs bg-layer-2 border border-border-subtle text-on-surface"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="m-0 p-md rounded-xs bg-layer-2 border border-border-default overflow-x-auto text-mono-sm [&_code]:p-0 [&_code]:bg-transparent [&_code]:border-0"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto border border-border-default rounded-xs bg-layer-2">
      <table className="w-full border-collapse text-left text-body-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      className="h-control-sm py-2xs px-sm bg-layer-2 text-on-surface-secondary text-label-sm border-b border-border-default whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td
      className="h-control-md py-xs px-sm bg-layer-1 border-b border-border-subtle text-on-surface align-middle"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="hover:bg-hover last:[&_td]:border-b-0" {...props} />
  ),
  ColorPalette
}
