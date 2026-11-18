import { createContext } from 'react'

export interface DisclosureGroupContextValue {
  variant?: 'bordered' | 'ghost'
  isGrouped?: boolean
}

export const DisclosureGroupContext = createContext<DisclosureGroupContextValue>({})
