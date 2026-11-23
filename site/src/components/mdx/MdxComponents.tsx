import type { ComponentPropsWithoutRef } from 'react'
import type { useMDXComponents } from '@mdx-js/react'
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteListBox,
  AutocompleteSearchField,
  Badge,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  ComboBoxItem,
  ComboBoxListBox,
  ComboBoxPopover,
  ComboBoxSection,
  DateField,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  FileTrigger,
  Form,
  FormActions,
  FormSection,
  Input,
  Label,
  ListBox,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
  ListBoxSeparator,
  Menu,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  Modal,
  ModalContent,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverDialog,
  PopoverTrigger,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  SelectHeader,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetBackdrop,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPanel,
  SheetTrigger,
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextField,
  Toast,
  ToastContent,
  ToastList,
  ToastRegion,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
  Tree,
  TreeCollection,
  TreeHeader,
  TreeItem,
  TreeItemContent,
  TreeSection
} from '@pact-design/react'
import { ColorPalette } from '../demos/ColorPalette'
import { CodeBlock } from './CodeBlock'
import { CodeDemo } from './CodeDemo'
import { ComponentPreview } from './ComponentPreview'

export const mdxComponents: ReturnType<typeof useMDXComponents> = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      data-doc-heading=""
      className="my-sm text-heading-md text-on-surface-default scroll-mt-xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-sm text-heading-sm font-medium text-on-surface scroll-mt-xl" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-body-md text-on-surface-secondary" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="text-on-surface font-bold" {...props} />
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
  hr: ({ className }: ComponentPropsWithoutRef<'hr'>) => (
    <Separator className={className ? `my-xs ${className}` : 'my-xs'} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="m-0 py-sm px-md border-l-lg border-primary bg-layer-1 rounded-r-xs text-on-surface-secondary"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="text-mono-sm px-xs py-1px rounded-2xs bg-layer-2 border border-border-subtle text-on-surface"
      {...props}
    />
  ),
  pre: ({
    'data-in-demo': inDemo,
    className = '',
    style,
    ...props
  }: ComponentPropsWithoutRef<'pre'> & { 'data-in-demo'?: string }) => {
    if (inDemo === 'true') {
      const { backgroundColor: _bg, ...restStyle } = style ?? {}
      return (
        <pre
          className={`m-0 p-md bg-layer-1 overflow-x-auto text-mono-sm [&_code]:p-0 [&_code]:bg-transparent [&_code]:border-0 ${className}`.trim()}
          style={restStyle}
          {...props}
        />
      )
    }
    return <CodeBlock className={className} style={style} {...props} />
  },
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
  ColorPalette,
  CodeDemo,
  ComponentPreview,
  Autocomplete,
  AutocompleteItem,
  AutocompleteListBox,
  AutocompleteSearchField,
  Badge,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  ComboBoxItem,
  ComboBoxListBox,
  ComboBoxPopover,
  ComboBoxSection,
  DateField,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
  FieldButton,
  FieldDescription,
  FieldError,
  FieldGroup,
  FileTrigger,
  Form,
  FormActions,
  FormSection,
  Input,
  Label,
  ListBox,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
  ListBoxSeparator,
  Menu,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  Modal,
  ModalContent,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverDialog,
  PopoverTrigger,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  SelectHeader,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetBackdrop,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPanel,
  SheetTrigger,
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextField,
  Toast,
  ToastContent,
  ToastList,
  ToastRegion,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
  Tree,
  TreeCollection,
  TreeHeader,
  TreeItem,
  TreeItemContent,
  TreeSection
}
