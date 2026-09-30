import type { Block } from 'payload'

import { link } from '../fields/link'
import { headingDescription, sectionSettings } from '../fields/section'

// Generated from ACF group "Intro Content" (group_618a5b434ec98) by scripts/acf-to-payload.
export const IntroContent: Block = {
  slug: 'introContent',
  imageURL: '/admin/blocks/introContent.jpg',
  admin: { group: 'Text & media' },
  interfaceName: 'IntroContentBlock',
  labels: {
    singular: 'Text section',
    plural: 'Text sections',
  },
  fields: [
    // Hand-added for the redesign: the theme only has the centred layout.
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'split',
      required: true,
      options: [
        { label: 'Split (heading left, content right)', value: 'split' },
        { label: 'Centred', value: 'centred' },
      ],
    },
    {
      name: 'heading',
      label: 'Intro Heading',
      type: 'text',
      admin: { description: headingDescription },
    },
    {
      name: 'eyebrow',
      label: 'Intro Eyebrow',
      type: 'text',
    },
    // Hand-added: shows a large figure in place of the heading (e.g. "£500k+").
    {
      name: 'stat',
      type: 'group',
      admin: {
        description: 'Optional large figure shown instead of the heading, e.g. "£500k+".',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text' },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
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
    // Hand-added: links shown under the heading on the split layout (e.g. social pills).
    {
      name: 'headingLinks',
      label: 'Links Under Heading',
      type: 'array',
      maxRows: 4,
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'centred',
      },
      fields: [
        link({
          name: 'button',
          label: 'Link',
        }),
      ],
    },
    // Hand-added: wide rounded image under the text (Careers call to action).
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    sectionSettings,
  ],
}
