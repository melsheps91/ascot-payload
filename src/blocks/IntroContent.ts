import type { Block } from 'payload'

import { link } from '../fields/link'

// Generated from ACF group "Intro Content" (group_618a5b434ec98) by scripts/acf-to-payload.
export const IntroContent: Block = {
  slug: 'introContent',
  interfaceName: 'IntroContentBlock',
  labels: {
    singular: 'Intro Content',
    plural: 'Intro Contents',
  },
  fields: [
    {
      name: 'heading',
      label: 'Intro Heading',
      type: 'text',
    },
    {
      name: 'eyebrow',
      label: 'Intro Eyebrow',
      type: 'text',
    },
    // Hand-added: WordPress renders this from the page's main editor (the_content), not ACF.
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
      required: true,
    },
    {
      name: 'buttons',
      label: 'Intro Buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        link({
          name: 'button',
          label: 'Button',
        }),
      ],
    },
  ],
}
