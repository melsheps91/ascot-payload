import type { Block } from 'payload'

import { sectionIntro, sectionSettings } from '../fields/section'

// Port of inc/content/testimonials-slider.php. WordPress reads the intro from the
// "Global Sections" options page and loops the testimonials post type; here the intro
// lives on the block and you pick which testimonials to show.
export const Testimonials: Block = {
  slug: 'testimonials',
  imageURL: '/admin/blocks/testimonials.jpg',
  admin: { group: 'Grids & cards' },
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    sectionIntro,
    {
      name: 'style',
      type: 'select',
      defaultValue: 'grid',
      required: true,
      options: [
        { label: 'Large quote (first testimonial only)', value: 'quote' },
        { label: 'Cards', value: 'grid' },
        { label: 'Slider', value: 'slider' },
      ],
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Leave empty to show the six most recent.' },
    },
    sectionSettings,
  ],
}
