import type { Block } from 'payload'

import { link } from '../fields/link'

// Mirrors ACF group "Banner" (group_616d7a7d96c54) plus the theme's four banner templates
// (inc/header/banner-*.php), which WordPress picks by page template.
export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
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
        { label: 'Large (text left)', value: 'large' },
        { label: 'Home (centred panel)', value: 'home' },
        { label: 'Default (compact, centred)', value: 'default' },
        { label: 'Split (text beside media)', value: 'split' },
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
        description: 'Leave empty to use the page title.',
      },
    },
    {
      name: 'buttons',
      label: 'Banner Buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        link({
          name: 'button',
          label: 'Button',
        }),
      ],
    },
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
