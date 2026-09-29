import type { Field } from 'payload'

import { link } from './link'

export const headingDescription = 'Wrap words in *asterisks* to make them bold.'

// Background and anchor shared by every block. Consecutive blocks on the same
// background collapse the padding between them.
export const sectionSettings: Field = {
  type: 'collapsible',
  label: 'Section settings',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'theme',
          label: 'Background',
          type: 'select',
          defaultValue: 'light',
          required: true,
          options: [
            { label: 'White', value: 'light' },
            { label: 'Grey', value: 'grey' },
            { label: 'Navy', value: 'dark' },
          ],
        },
        {
          name: 'anchor',
          label: 'Anchor ID',
          type: 'text',
          admin: { description: 'Lets buttons link to this section, e.g. "about" for #about.' },
        },
      ],
    },
  ],
}

// The theme's `{prefix}_intro_heading`, `_intro_button` and `_intro_text` fields, plus an eyebrow.
export const sectionIntro: Field = {
  type: 'collapsible',
  label: 'Intro',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'introEyebrow', label: 'Intro Eyebrow', type: 'text' },
        {
          name: 'introHeading',
          label: 'Intro Heading',
          type: 'text',
          admin: { description: headingDescription },
        },
      ],
    },
    { name: 'introText', label: 'Intro Text', type: 'textarea' },
    link({ name: 'introButton', label: 'Intro Button' }),
  ],
}
