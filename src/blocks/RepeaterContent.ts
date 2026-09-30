import type { Block } from 'payload'

import { link } from '../fields/link'
import { headingDescription, sectionSettings } from '../fields/section'

// Generated from ACF group "Repeater Content" (group_616ffdcb24300) by scripts/acf-to-payload.
// Hand-added for the redesign: logo, tags, the starting image side and the section settings.
export const RepeaterContent: Block = {
  slug: 'repeaterContent',
  imageURL: '/admin/blocks/repeaterContent.jpg',
  admin: { group: 'Text & media' },
  interfaceName: 'RepeaterContentBlock',
  labels: {
    singular: 'Image & text rows',
    plural: 'Image & text rows',
  },
  fields: [
    {
      name: 'firstImageSide',
      label: 'First Row Image Side',
      type: 'radio',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Rows alternate sides from here.',
      },
    },
    {
      name: 'rows',
      label: 'Repeater Content',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Content',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
                    {
                      name: 'logo',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Optional logo shown beside the eyebrow.' },
                    },
                  ],
                },
                {
                  name: 'heading',
                  label: 'Heading',
                  type: 'text',
                  admin: { description: headingDescription },
                },
                { name: 'content', label: 'Content', type: 'richText' },
                {
                  name: 'tags',
                  type: 'array',
                  admin: { description: 'Shown as pills under the content.' },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'buttons',
                  label: 'Buttons',
                  type: 'array',
                  maxRows: 2,
                  fields: [link({ name: 'button', label: 'Button' })],
                },
              ],
            },
            {
              label: 'Media',
              fields: [
                {
                  name: 'mediaType',
                  label: 'Media Type',
                  type: 'radio',
                  defaultValue: 'image',
                  options: [
                    { label: 'Image', value: 'image' },
                    { label: 'Video', value: 'video' },
                  ],
                  admin: { layout: 'horizontal' },
                },
                {
                  name: 'imageFit',
                  label: 'Image Fit',
                  type: 'radio',
                  defaultValue: 'cover',
                  options: [
                    { label: 'Cover', value: 'cover' },
                    { label: 'Fit', value: 'fit' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.mediaType !== 'video',
                    layout: 'horizontal',
                  },
                },
                {
                  name: 'images',
                  label: 'Images',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.mediaType !== 'video',
                    description: 'Add more than one image to show a slider.',
                  },
                },
                {
                  name: 'videoType',
                  label: 'Video Type',
                  type: 'radio',
                  defaultValue: 'youtube',
                  options: [
                    { label: 'Youtube', value: 'youtube' },
                    { label: 'Local', value: 'local' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.mediaType === 'video',
                    layout: 'horizontal',
                  },
                },
                {
                  name: 'youtubeLink',
                  label: 'Youtube Link',
                  type: 'text',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.mediaType === 'video' && siblingData?.videoType !== 'local',
                  },
                },
                {
                  name: 'video',
                  label: 'Video',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.mediaType === 'video' && siblingData?.videoType === 'local',
                  },
                },
                {
                  name: 'videoPoster',
                  label: 'Video Poster',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.mediaType === 'video' && siblingData?.videoType === 'local',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    sectionSettings,
  ],
}
