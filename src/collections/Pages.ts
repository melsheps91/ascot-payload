import { type Block, type CollectionConfig, slugField } from 'payload'

import { Banner } from '../blocks/Banner'
import { FormSection } from '../blocks/FormSection'
import { Gallery } from '../blocks/Gallery'
import { IconGrid } from '../blocks/IconGrid'
import { IntroContent } from '../blocks/IntroContent'
import { JobsList } from '../blocks/JobsList'
import { LatestNews } from '../blocks/LatestNews'
import { LogoGrid } from '../blocks/LogoGrid'
import { NumberedSections } from '../blocks/NumberedSections'
import { PostsLoop } from '../blocks/PostsLoop'
import { ProductCardsManual } from '../blocks/ProductCardsManual'
import { RepeaterContent } from '../blocks/RepeaterContent'
import { Testimonials } from '../blocks/Testimonials'
import { Ticker } from '../blocks/Ticker'
import { Timeline } from '../blocks/Timeline'
import { meta } from '../fields/meta'
import { revalidateHooks } from '../hooks/revalidate'
import { pagePath } from '../lib/routes'

// Shows each block's heading in its header in the editor (src/components/admin/BlockLabel.tsx).
const withSummaryLabel = (block: Block): Block => ({
  ...block,
  admin: {
    ...block.admin,
    components: {
      ...block.admin?.components,
      Label: {
        path: '/components/admin/BlockLabel#BlockLabel',
        clientProps: { blockLabel: block.labels?.singular ?? block.slug },
      },
    },
  },
})

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Every page on the site. Each is built from blocks; the page with the slug "home" is the homepage.',
    preview: (doc) => (typeof doc?.slug === 'string' ? pagePath(doc.slug) : null),
  },
  access: {
    read: () => true,
  },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({ position: 'sidebar' }),
    meta,
    {
      name: 'layout',
      label: 'Sections',
      labels: { singular: 'Section', plural: 'Sections' },
      type: 'blocks',
      admin: { description: 'The page is built from these sections, top to bottom. Drag to reorder.' },
      blocks: [
        Banner,
        Ticker,
        IntroContent,
        ProductCardsManual,
        IconGrid,
        RepeaterContent,
        Timeline,
        LogoGrid,
        Gallery,
        Testimonials,
        JobsList,
        PostsLoop,
        LatestNews,
        FormSection,
        NumberedSections,
      ].map(withSummaryLabel),
    },
  ],
}
