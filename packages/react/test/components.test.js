import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseDate } from '@internationalized/date'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Autocomplete,
  AutocompleteItem,
  Breadcrumbs,
  Button,
  Calendar,
  Checkbox,
  ComboBox,
  ComboBoxItem,
  DateField,
  DatePicker,
  Disclosure,
  FileTrigger,
  ModalCloseButton,
  SearchField,
  Select,
  SelectItem,
  Switch,
  TextField
} from '../dist/index.js'

const h = React.createElement

function CustomSvgIcon({ className }) {
  return h('svg', { className, 'data-custom-icon': 'component' })
}

describe('@pact-design/react component contracts (SSR)', () => {
  it('binds disabled and isDisabled identically across interactive controls', () => {
    const selectDisabled = renderToStaticMarkup(
      h(
        Select,
        { label: 'Role', disabled: true, defaultSelectedKey: 'admin' },
        h(SelectItem, { id: 'admin' }, 'Admin')
      )
    )
    const selectIsDisabled = renderToStaticMarkup(
      h(
        Select,
        { label: 'Role', isDisabled: true, defaultSelectedKey: 'admin' },
        h(SelectItem, { id: 'admin' }, 'Admin')
      )
    )
    assert.match(selectDisabled, /data-disabled="true"/)
    assert.match(selectDisabled, /<button[^>]*disabled=""/)
    assert.doesNotMatch(selectDisabled, /<div[^>]*\sdisabled(?:=|\s|>)/)
    assert.match(selectIsDisabled, /data-disabled="true"/)
    assert.match(selectIsDisabled, /<button[^>]*disabled=""/)

    const datePickerDisabled = renderToStaticMarkup(
      h(DatePicker, { label: 'Release', disabled: true, defaultValue: parseDate('2026-11-18') })
    )
    assert.match(datePickerDisabled, /pd-field-group[^>]*data-disabled="true"/)

    const autocompleteDisabled = renderToStaticMarkup(
      h(
        Autocomplete,
        { label: 'Search', disabled: true },
        h(AutocompleteItem, { id: 'a' }, 'Alpha')
      )
    )
    assert.match(autocompleteDisabled, /class="pd-field" data-disabled=""/)
    assert.match(autocompleteDisabled, /<input[^>]*disabled=""/)

    const fileTriggerDisabled = renderToStaticMarkup(
      h(FileTrigger, { disabled: true, label: 'Upload' })
    )
    assert.match(fileTriggerDisabled, /<button[^>]*disabled=""/)

    const buttonDisabled = renderToStaticMarkup(h(Button, { disabled: true }, 'Save'))
    assert.match(buttonDisabled, /<button[^>]*disabled=""/)

    const switchDisabled = renderToStaticMarkup(h(Switch, { disabled: true, label: 'Notify' }))
    assert.match(switchDisabled, /data-disabled="true"/)
  })

  it('supports clearable defaults, opt-in/opt-out, and custom clear icons', () => {
    // SearchField defaults to clearable=true
    const searchDefault = renderToStaticMarkup(h(SearchField, { label: 'Find', defaultValue: 'abc' }))
    assert.match(searchDefault, /pd-search-field-clear/)

    // SearchField clearable={false} hides the clear button
    const searchNoClear = renderToStaticMarkup(h(SearchField, { label: 'Find', clearable: false, defaultValue: 'abc' }))
    assert.doesNotMatch(searchNoClear, /pd-search-field-clear/)

    // Custom component icon via clearable={{ icon: Component }}
    const textFieldClear = renderToStaticMarkup(
      h(TextField, {
        label: 'Name',
        defaultValue: 'Pact',
        clearable: { icon: CustomSvgIcon, label: 'Clear name' }
      })
    )
    assert.match(textFieldClear, /pd-field-clear/)
    assert.match(textFieldClear, /aria-label="Clear name"/)
    assert.match(textFieldClear, /data-custom-icon="component"/)

    // Disabled clearable field hides clear button
    const textFieldDisabledClear = renderToStaticMarkup(
      h(TextField, { label: 'Name', defaultValue: 'Pact', clearable: true, disabled: true })
    )
    assert.doesNotMatch(textFieldDisabledClear, /pd-field-clear/)

    // Select renders clear button as a sibling (never nested inside trigger <button>)
    const selectClear = renderToStaticMarkup(
      h(
        Select,
        { label: 'Role', clearable: true, defaultSelectedKey: 'admin' },
        h(SelectItem, { id: 'admin' }, 'Admin')
      )
    )
    assert.match(selectClear, /pd-select-control/)
    assert.match(selectClear, /pd-select-clear/)
    assert.doesNotMatch(selectClear, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/)

    // ComboBox, DatePicker, DateField clearable render clear button when value is set
    const comboClear = renderToStaticMarkup(
      h(
        ComboBox,
        { label: 'Region', clearable: true, defaultSelectedKey: 'taipei' },
        h(ComboBoxItem, { id: 'taipei' }, 'Taipei')
      )
    )
    assert.match(comboClear, /pd-field-clear/)

    const datePickerClear = renderToStaticMarkup(
      h(DatePicker, { label: 'Date', clearable: true, defaultValue: parseDate('2026-11-18') })
    )
    assert.match(datePickerClear, /pd-field-clear/)

    const dateFieldClear = renderToStaticMarkup(
      h(DateField, { label: 'Date', clearable: true, defaultValue: parseDate('2026-11-18') })
    )
    assert.match(dateFieldClear, /pd-field-clear/)
  })

  it('supports selectionMode="multiple" on Select and ComboBox', () => {
    const multiSelect = renderToStaticMarkup(
      h(
        Select,
        { label: 'Roles', selectionMode: 'multiple', defaultValue: ['viewer', 'admin'] },
        h(SelectItem, { id: 'viewer' }, 'Viewer'),
        h(SelectItem, { id: 'editor' }, 'Editor'),
        h(SelectItem, { id: 'admin' }, 'Admin')
      )
    )
    assert.match(multiSelect, /Viewer/)
    assert.match(multiSelect, /Admin/)

    const multiCombo = renderToStaticMarkup(
      h(
        ComboBox,
        { label: 'Regions', selectionMode: 'multiple', defaultValue: ['taipei', 'tokyo'] },
        h(ComboBoxItem, { id: 'taipei' }, 'Taipei'),
        h(ComboBoxItem, { id: 'tokyo' }, 'Tokyo'),
        h(ComboBoxItem, { id: 'london' }, 'London')
      )
    )
    assert.match(multiCombo, /pd-field-group-multiline/)
    assert.match(multiCombo, /pd-combobox-tags/)
    assert.match(multiCombo, /pd-combobox-tag-label">Taipei/)
    assert.match(multiCombo, /pd-combobox-tag-label">Tokyo/)
    assert.match(multiCombo, /aria-label="Remove Taipei"/)
  })

  it('allows per-component icon customization with both components and JSX elements', () => {
    const customElement = h('span', { 'data-custom-icon': 'element' }, '*')

    const selectHtml = renderToStaticMarkup(
      h(
        Select,
        { label: 'Role', icons: { chevron: CustomSvgIcon } },
        h(SelectItem, { id: 'a' }, 'A')
      )
    )
    assert.match(selectHtml, /data-custom-icon="component"/)
    assert.match(selectHtml, /pd-select-chevron/)

    const checkboxHtml = renderToStaticMarkup(
      h(Checkbox, { label: 'Agree', defaultChecked: true, icons: { check: customElement } })
    )
    assert.match(checkboxHtml, /data-custom-icon="element"/)
    assert.match(checkboxHtml, /pd-checkbox-icon/)

    const calendarHtml = renderToStaticMarkup(
      h(Calendar, {
        'aria-label': 'Calendar',
        icons: { previous: CustomSvgIcon, next: customElement }
      })
    )
    assert.match(calendarHtml, /data-custom-icon="component"/)
    assert.match(calendarHtml, /data-custom-icon="element"/)

    const disclosureHtml = renderToStaticMarkup(
      h(Disclosure, { title: 'Details', icons: { chevron: CustomSvgIcon } }, 'Body')
    )
    assert.match(disclosureHtml, /data-custom-icon="component"/)

    const breadcrumbsHtml = renderToStaticMarkup(
      h(Breadcrumbs, {
        items: [{ label: 'Home', href: '/' }, { label: 'Docs' }],
        icons: { separator: '/' }
      })
    )
    assert.match(breadcrumbsHtml, />\/<\/span>/)

    const closeBtnHtml = renderToStaticMarkup(
      h(ModalCloseButton, { icons: { close: CustomSvgIcon } })
    )
    assert.match(closeBtnHtml, /data-custom-icon="component"/)
    assert.match(closeBtnHtml, /pd-dialog-close-icon/)
  })
})
