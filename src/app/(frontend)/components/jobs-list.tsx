import type { JobsListBlock } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { jobPath } from '@/lib/routes'

import { JobsFilter } from './jobs-filter'
import { Autop } from './shared/autop'
import { Button } from './shared/button'
import { Section, SectionIntro } from './shared/section'

export async function JobsList({ block }: { block: JobsListBlock }) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'jobs',
    where: { status: { equals: 'open' } },
    sort: 'title',
    limit: 100,
    select: { title: true, slug: true, company: true, location: true },
  })

  const jobs = docs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    href: jobPath(job.slug),
  }))

  const { cta } = block

  return (
    <Section block={block} name="jobs-list">
      <div className="container">
        <SectionIntro block={block} size="large" />
        <JobsFilter emptyText={block.emptyText ?? ''} jobs={jobs} />
        {(cta?.heading || cta?.text) && (
          <div className="jobs-cta primary-back">
            <div className="jobs-cta-text">
              {cta.heading && <h3>{cta.heading}</h3>}
              <Autop text={cta.text} />
            </div>
            <Button link={cta.button} />
          </div>
        )}
      </div>
    </Section>
  )
}
