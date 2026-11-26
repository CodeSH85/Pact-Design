import { type ComponentType } from 'react'
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiCheckLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiSearchLine,
  RiSubtractLine,
  RiUpload2Line
} from '@remixicon/react'
import { type PactIconName, type PactIconProps } from './types.ts'

export const defaultIcons: Record<PactIconName, ComponentType<PactIconProps>> = {
  chevronDown: RiArrowDownSLine,
  chevronRight: RiArrowRightSLine,
  chevronLeft: RiArrowLeftSLine,
  check: RiCheckLine,
  indeterminate: RiSubtractLine,
  close: RiCloseLine,
  clear: RiCloseLine,
  search: RiSearchLine,
  calendar: RiCalendarLine,
  upload: RiUpload2Line,
  info: RiInformationLine,
  success: RiCheckboxCircleLine,
  warning: RiAlertLine,
  danger: RiErrorWarningLine
}
