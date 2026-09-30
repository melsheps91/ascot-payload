import type { Page } from '@/payload-types'

import { Banner } from './banner'
import { FormSection } from './form-section'
import { Gallery } from './gallery'
import { IconGrid } from './icon-grid'
import { IntroContent } from './intro-content'
import { JobsList } from './jobs-list'
import { LatestNews } from './latest-news'
import { LogoGrid } from './logo-grid'
import { NumberedSections } from './numbered-sections'
import { type LoopParams, PostsLoop } from './posts-loop'
import { ProductCardsManual } from './product-cards-manual'
import { RepeaterContent } from './repeater-content'
import { Testimonials } from './testimonials'
import { Ticker } from './ticker'
import { Timeline } from './timeline'

// The equivalent of a page template's list of includes.
export function RenderBlocks({ page, path, params = {} }: { page: Page; path: string; params?: LoopParams }) {
  return (
    <>
      {page.layout?.map((block) => {
        switch (block.blockType) {
          case 'banner':
            return <Banner block={block} key={block.id} pageTitle={page.title} path={path} />
          case 'ticker':
            return <Ticker block={block} key={block.id} />
          case 'introContent':
            return <IntroContent block={block} key={block.id} />
          case 'productCardsManual':
            return <ProductCardsManual block={block} key={block.id} />
          case 'iconGrid':
            return <IconGrid block={block} key={block.id} />
          case 'repeaterContent':
            return <RepeaterContent block={block} key={block.id} />
          case 'timeline':
            return <Timeline block={block} key={block.id} />
          case 'logoGrid':
            return <LogoGrid block={block} key={block.id} />
          case 'gallery':
            return <Gallery block={block} key={block.id} />
          case 'testimonials':
            return <Testimonials block={block} key={block.id} />
          case 'jobsList':
            return <JobsList block={block} key={block.id} />
          case 'postsLoop':
            return <PostsLoop block={block} key={block.id} params={params} path={path} />
          case 'latestNews':
            return <LatestNews block={block} key={block.id} />
          case 'formSection':
            return <FormSection block={block} key={block.id} pageTitle={page.title} />
          case 'numberedSections':
            return <NumberedSections block={block} key={block.id} />
          default:
            return null
        }
      })}
    </>
  )
}
