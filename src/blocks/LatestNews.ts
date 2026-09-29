import type { Block } from 'payload'

import { sectionIntro, sectionSettings } from '../fields/section'

// Port of inc/content/latest-news.php (intro fields from ACF "Global Sections").
export const LatestNews: Block = {
  slug: 'latestNews',
  imageURL: '/admin/blocks/latestNews.jpg',
  admin: { group: 'News & jobs' },
  interfaceName: 'LatestNewsBlock',
  labels: {
    singular: 'Latest news',
    plural: 'Latest news',
  },
  fields: [
    sectionIntro,
    {
      name: 'limit',
      label: 'Number of articles',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
    sectionSettings,
  ],
}
