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

export const componentTokens = {
  button: buttonTokens,
  checkbox: checkboxTokens,
  disclosure: disclosureTokens,
  field: fieldTokens,
  modal: modalTokens,
  popover: popoverTokens,
  radio: radioTokens,
  switch: switchTokens,
  tab: tabTokens,
  toast: toastTokens
} as const
