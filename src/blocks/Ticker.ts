import type { Block } from 'payload'

import { sectionSettings } from '../fields/section'

// New for the redesign (no CleanBuildPro equivalent): a scrolling strip of words.
export const Ticker: Block = {
  slug: 'ticker',
  imageURL: '/admin/blocks/ticker.jpg',
  admin: { group: 'Text & media' },
  interfaceName: 'TickerBlock',
  labels: {
    singular: 'Scrolling ticker',
    plural: 'Scrolling tickers',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'duration',
      label: 'Seconds per loop',
      type: 'number',
      defaultValue: 40,
      min: 5,
    },
    sectionSettings,
  ],
}
