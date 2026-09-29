import type { Block } from 'payload'

import { link } from '../fields/link'
import { headingDescription } from '../fields/section'

// Mirrors ACF group "Banner" (group_616d7a7d96c54) plus the theme's four banner templates
// (inc/header/banner-*.php), which WordPress picks by page template. The variants are
// restyled to the Ascot redesign; their values are kept so existing banners still work.
export const Banner: Block = {
  slug: 'banner',
  imageURL: '/admin/blocks/banner.jpg',
  admin: { group: 'Page headers' },
  interfaceName: 'BannerBlock',
  labels: {
    singular: 'Page header',
    plural: 'Page headers',
  },
  fields: [
    // Hand-added: WordPress chooses the banner template from the page template.
    {
      name: 'variant',
      label: 'Banner Style',
      type: 'select',
      defaultValue: 'large',
      required: true,
      options: [
        { label: 'Home (full height, with stats)', value: 'home' },
        { label: 'Large (image, title and intro)', value: 'large' },
        { label: 'Split (text beside a portrait image)', value: 'split' },
        { label: 'Default (navy header, no image)', value: 'default' },
      ],
    },
    {
      name: 'preHeading',
      label: 'Banner Pre-Heading',
      type: 'text',
    },
    {
      name: 'heading',
      label: 'Banner Heading',
      type: 'text',
      admin: {
        description: `Leave empty to use the page title. ${headingDescription}`,
      },
    },
    {
      name: 'buttons',
      label: 'Banner Buttons',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'On the Default style, buttons show as pill tabs and the one linking to the current page is highlighted.',
      },
      fields: [
        link({
          name: 'button',
          label: 'Button',
        }),
      ],
    },
    // Hand-added for the redesign's home hero.
    {
      name: 'stats',
      label: 'Stats',
      type: 'array',
      maxRows: 4,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'home',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    link({
      name: 'scrollLink',
      label: 'Scroll Link',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'home',
        description: 'The round arrow link beside the stats, e.g. "Discover the Group" to #about.',
      },
    }),
    {
      name: 'type',
      label: 'Banner Type',
      type: 'radio',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'text',
      label: 'Banner Text',
      type: 'textarea',
    },
    {
      name: 'images',
      label: 'Banner Images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        condition: (_, siblingData) => siblingData?.type !== 'video',
        description: 'Add more than one image to show a fading slideshow.',
      },
    },
    // Hand-added: where the image is anchored when the header crops it.
    {
      name: 'imagePosition',
      label: 'Image Position',
      type: 'select',
      defaultValue: 'focal',
      options: [
        { label: "Image's focal point (set in Images & files)", value: 'focal' },
        { label: 'Top', value: 'top' },
        { label: 'Centre', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.type !== 'video',
        description:
          'Which part of the image stays in view when the header crops it. The focal point is set by clicking on the image in Images & files.',
      },
    },
    {
      name: 'videoType',
      label: 'Banner Video Type',
      type: 'radio',
      defaultValue: 'youtube',
      options: [
        { label: 'Youtube', value: 'youtube' },
        { label: 'Local', value: 'local' },
      ],
      admin: {
        layout: 'horizontal',
        condition: (_, siblingData) => siblingData?.type === 'video',
      },
    },
    {
      name: 'youtube',
      label: 'Banner Youtube',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'video' && siblingData?.videoType !== 'local',
        description: 'YouTube URL. Plays muted in the background and adds a "Play Video" button.',
      },
    },
    {
      name: 'video',
      label: 'Banner Video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'video' },
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'video' && siblingData?.videoType === 'local',
        description: 'Short muted loop for the background (mp4 or mov).',
      },
    },
    {
      name: 'fullVideo',
      label: 'Banner Full Video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'video' },
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'video' && siblingData?.videoType === 'local',
        description: 'Optional full-length video, opened by a "Play Video" button.',
      },
    },
    {
      name: 'videoFallback',
      label: 'Banner Video Fallback',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'video' && siblingData?.videoType === 'local',
        description: 'Poster image shown while the video loads.',
      },
    },
  ],
}
