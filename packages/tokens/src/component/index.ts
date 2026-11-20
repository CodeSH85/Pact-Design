import { buttonTokens } from './button.ts'
import { checkboxTokens } from './checkbox.ts'
import { disclosureTokens } from './disclosure.ts'
import { fieldTokens } from './field.ts'
import { modalTokens } from './modal.ts'
import { popoverTokens } from './popover.ts'
import { radioTokens } from './radio.ts'
import { switchTokens } from './switch.ts'
import { tabTokens } from './tab.ts'
import { toastTokens } from './toast.ts'

export const componentFiles = {
  'component/button': { component: buttonTokens },
  'component/checkbox': { component: checkboxTokens },
  'component/disclosure': { component: disclosureTokens },
  'component/field': { component: fieldTokens },
  'component/modal': { component: modalTokens },
  'component/popover': { component: popoverTokens },
  'component/radio': { component: radioTokens },
  'component/switch': { component: switchTokens },
  'component/tab': { component: tabTokens },
  'component/toast': { component: toastTokens }
} as const
