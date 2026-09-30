import type { Block } from 'payload'

import { headingDescription } from '../fields/section'

// Based on ACF group "Form Shortcode" (group_5aa6ab49c1038) and inc/content/form-section.php:
// a form beside the company contact details. The shortcode becomes a relationship to a
// Form Builder form.
export const FormSection: Block = {
  slug: 'formSection',
  imageURL: '/admin/blocks/formSection.jpg',
  admin: { group: 'Forms & legal' },
  interfaceName: 'FormSectionBlock',
  labels: {
    singular: 'Contact form section',
    plural: 'Contact form sections',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text' },
        {
          name: 'heading',
          type: 'text',
          admin: { description: `Shown as the page's main heading. ${headingDescription}` },
        },
      ],
    },
    {
      name: 'showContactDetails',
      label: 'Show contact details',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Phone, address and social links from Company Details.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'formHeading', label: 'Form Heading', type: 'text' },
        { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
      ],
    },
  ],
}
