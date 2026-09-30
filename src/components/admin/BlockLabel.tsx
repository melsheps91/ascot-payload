'use client'

import { Pill, useRowLabel } from '@payloadcms/ui'

type Row = Record<string, unknown>

// Fields that describe a block best, in order of preference.
const SUMMARY_FIELDS = ['heading', 'introHeading', 'preHeading', 'eyebrow', 'introEyebrow', 'formHeading']

const clean = (value: string) => value.replace(/\*/g, '').replace(/\s+/g, ' ').trim()

const summarise = (data: Row): string => {
  for (const name of SUMMARY_FIELDS) {
    const value = data[name]
    if (typeof value === 'string' && value.trim()) return clean(value)
  }
  if (typeof data.stat === 'object' && data.stat && typeof (data.stat as Row).value === 'string') {
    return clean((data.stat as Row).value as string)
  }
  // Repeaters: describe the first item.
  for (const list of ['rows', 'cards', 'grid', 'items', 'sections', 'logos']) {
    const items = data[list]
    if (Array.isArray(items) && items.length) {
      const first = items[0] as Row
      const text = first.heading ?? first.title ?? first.label ?? first.name ?? first.year
      if (typeof text === 'string' && text.trim()) {
        return `${clean(text)}${items.length > 1 ? ` + ${items.length - 1} more` : ''}`
      }
    }
  }
  return ''
}

// Block header in the page editor: number, block type and a summary of its content,
// e.g. "03  Text section  The UK's leading marketing group…".
export function BlockLabel({ blockLabel }: { blockLabel: string }) {
  const { data, rowNumber } = useRowLabel<Row>()
  const summary = summarise(data ?? {})

  return (
    <span className="plx-block-label">
      <span className="blocks-field__block-number">{String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
      <Pill className="blocks-field__block-pill" pillStyle="white" size="small">
        {blockLabel}
      </Pill>
      {summary && <span className="plx-block-summary">{summary}</span>}
    </span>
  )
}
