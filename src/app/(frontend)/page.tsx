import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import type { Page } from '@/payload-types'
import './styles.css'
import { Banner } from './components/banner'
import { IntroContent } from './components/intro-content'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers }) 

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const {
    docs: [page]
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'test'
      },
    },
  })

  if (!page) {
    return <div>Page not found</div>
  }

  const renderBlocks = (block: NonNullable<Page['layout']>[number]) => {
    switch (block.blockType) {
      case 'banner':
        return <Banner block={block} key={block.id} pageTitle={page.title} />
      case 'introContent':
        return <IntroContent block={block} key={block.id} />
      default:
        return null
    }
  }

  return (
    <div>
      <h1>{page.title}</h1> 
      {/* <pre>{JSON.stringify(page.layout[0], null, 2)}</pre> */}
      <div className="Page">{page.layout?.map((block) => renderBlocks(block))}</div>
    </div>
  )
}
