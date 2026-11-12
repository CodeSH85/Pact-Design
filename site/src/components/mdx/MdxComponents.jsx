import { ColorPalette } from '../demos/ColorPalette.jsx'

export const mdxComponents = {
  h2: (props) => (
    <h2 className="mt-md text-heading-xs text-on-surface scroll-mt-xl" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-md text-subheader-md text-on-surface scroll-mt-xl" {...props} />
  ),
  p: (props) => (
    <p className="text-body-md text-on-surface-muted" {...props} />
  ),
  strong: (props) => (
    <strong className="text-on-surface" {...props} />
  ),
  a: (props) => (
    <a className="text-primary hover:text-primary-hover hover:underline" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-xl flex flex-col gap-xs text-on-surface-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="m-0 pl-xl flex flex-col gap-xs text-on-surface-muted list-decimal" {...props} />
  ),
  li: (props) => (
    <li className="leading-07" {...props} />
  ),
  hr: (props) => (
    <hr className="border-0 border-t border-border-default my-xs" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="m-0 py-sm px-md border-l-lg border-primary bg-layer-2 rounded-r-xs text-on-surface-secondary"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="text-mono-sm px-2xs py-1px rounded-2xs bg-layer-2 border border-border-subtle text-on-surface"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="m-0 p-md rounded-xs bg-layer-2 border border-border-default overflow-x-auto text-mono-sm [&_code]:p-0 [&_code]:bg-transparent [&_code]:border-0"
      {...props}
    />
  ),
  table: (props) => (
    <div className="overflow-x-auto border border-border-default rounded-xs bg-layer-2">
      <table className="w-full border-collapse text-left text-body-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="h-control-sm py-2xs px-sm bg-layer-1 text-on-surface-secondary text-label-sm border-b border-border-default whitespace-nowrap"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="h-control-md py-xs px-sm border-b border-border-subtle text-on-surface align-middle"
      {...props}
    />
  ),
  tr: (props) => (
    <tr className="hover:bg-hover last:[&_td]:border-b-0" {...props} />
  ),
  ColorPalette
}
