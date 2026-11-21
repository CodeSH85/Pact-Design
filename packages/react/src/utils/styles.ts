import { cva } from 'class-variance-authority'
import { focusRing, focusRingInset } from './focus.ts'

/**
 * Shared dropdown/collection item classes (Menu, Select, ComboBox, Autocomplete).
 */
export const collectionItemVariants = cva(
  [
    'flex items-center justify-between gap-popover-item-gap',
    'h-popover-item-height px-popover-item-padding-x rounded-popover-item-radius',
    'text-label-sm select-none cursor-pointer',
    focusRingInset,
    'data-[disabled]:text-popover-item-text-disabled data-[disabled]:cursor-not-allowed'
  ].join(' '),
  {
    variants: {
      tone: {
        default: [
          'text-popover-item-text',
          'data-[focused]:bg-popover-item-bg-hover data-[hovered]:bg-popover-item-bg-hover',
          'data-[selected]:bg-popover-item-bg-selected data-[selected]:font-medium'
        ].join(' '),
        danger: [
          'text-popover-item-text-danger',
          'data-[focused]:bg-popover-item-bg-danger-hover data-[hovered]:bg-popover-item-bg-danger-hover'
        ].join(' ')
      }
    },
    defaultVariants: {
      tone: 'default'
    }
  }
)

export const listBoxClasses = [
  'outline-none flex flex-col gap-popover-listbox-gap',
  'max-h-popover-listbox overflow-auto p-popover-listbox-padding'
].join(' ')

export const collectionSectionClasses = 'flex flex-col gap-popover-listbox-gap'

export const collectionHeaderClasses = [
  'px-popover-item-padding-x py-2xs',
  'text-caption-sm font-medium text-on-surface-muted select-none'
].join(' ')

export const collectionSeparatorClasses =
  'my-popover-separator-margin-y h-popover-separator-height bg-popover-separator-border border-0'

/**
 * Shared field wrapper, input, and embedded icon button classes.
 */
export const fieldWrapperClasses = 'relative flex flex-col gap-xs w-full'

export const fieldInputClasses =
  'w-full bg-transparent border-0 outline-none p-0 text-inherit placeholder:text-field-text-placeholder'

export const fieldIconButtonClasses = [
  'inline-flex items-center justify-center p-3xs rounded-2xs',
  'text-field-text-muted hover:text-field-text cursor-pointer outline-none',
  'data-[disabled]:text-field-text-disabled data-[disabled]:cursor-not-allowed'
].join(' ')

/**
 * Shared layout and typography helpers for inline selection controls (Checkbox, Switch, Radio).
 */
export const selectionControlRootClasses = [
  'group relative inline-flex items-start gap-xs select-none outline-none cursor-pointer',
  'data-[disabled]:cursor-not-allowed'
].join(' ')

export const selectionControlLabelStackClasses = 'flex flex-col gap-3xs'

export function selectionControlLabelClasses(isDisabled?: boolean): string {
  return `text-label-md leading-tight ${
    isDisabled ? 'text-on-surface-disabled' : 'text-on-surface'
  }`
}

export function selectionControlDescriptionClasses(isDisabled?: boolean): string {
  return `text-caption-md ${
    isDisabled ? 'text-on-surface-disabled' : 'text-on-surface-muted'
  }`
}

/**
 * Shared React Aria enter/exit motion and overlay chrome presets.
 */
export const enterExitFadeClasses =
  'entering:animate-in entering:fade-in-0 exiting:animate-out exiting:fade-out-0'

export const enterExitZoomClasses =
  'entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95'

export const overlayHeaderClasses = [
  'flex items-start justify-between gap-modal-header-gap',
  'pb-modal-header-padding-bottom border-b border-modal-header-border shrink-0'
].join(' ')

export const overlayFooterClasses = [
  'flex items-center justify-end gap-modal-footer-gap',
  'pt-modal-footer-padding-top border-t border-modal-footer-border shrink-0'
].join(' ')

export const overlayCloseButtonClasses = [
  'inline-flex items-center justify-center p-2xs rounded-xs text-on-surface-muted cursor-pointer',
  'hover:bg-hover hover:text-on-surface active:bg-active',
  focusRing
].join(' ')
