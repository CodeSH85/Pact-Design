/**
 * Default outer focus ring (+2px offset) for standalone controls (Button, ToggleButton, Checkbox, Switch).
 */
export const focusRing = [
  'outline-none',
  'data-[focus-visible]:outline data-[focus-visible]:outline-2',
  'data-[focus-visible]:outline-border-focus data-[focus-visible]:outline-offset-2'
].join(' ')

/**
 * Flush focus ring (0px offset) for adjacent toolbar or composite field controls.
 */
export const focusRingFlush = [
  'outline-none',
  'data-[focus-visible]:outline data-[focus-visible]:outline-2',
  'data-[focus-visible]:outline-border-focus data-[focus-visible]:outline-offset-0'
].join(' ')

/**
 * Inset focus ring (-2px offset) for items inside overflow-hidden containers (Disclosure headers, List/Menu items).
 */
export const focusRingInset = [
  'outline-none',
  'data-[focus-visible]:outline data-[focus-visible]:outline-2',
  'data-[focus-visible]:outline-border-focus data-[focus-visible]:-outline-offset-2'
].join(' ')

/**
 * Group-scoped outer focus ring (+2px offset) for composite controls whose root element receives data-[focus-visible].
 */
export const groupFocusRing = [
  'group-data-[focus-visible]:outline group-data-[focus-visible]:outline-2',
  'group-data-[focus-visible]:outline-border-focus group-data-[focus-visible]:outline-offset-2'
].join(' ')

/**
 * Standard disabled surface and cursor classes for interactive controls.
 */
export const disabledStyles = [
  'data-[disabled]:bg-disabled data-[disabled]:text-on-surface-disabled',
  'data-[disabled]:border-transparent data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
].join(' ')
