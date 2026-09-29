import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getGlobals, getJobBySlug } from '@/lib/payload'
import { CAREERS_PATH } from '@/lib/routes'

import { EditButton } from '../../components/edit-button'
import { JobApplication } from '../job-application'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug((await params).slug)
  if (!job) return {}
  return {
    title: job.meta?.title || `${job.title} — ${job.company}`,
    description: job.meta?.description || job.summary,
  }
}

// Single vacancy (the WordPress "careers" post type).
export default async function JobPage({ params }: Props) {
  const job = await getJobBySlug((await params).slug)
  if (!job) notFound()

  const { jobSettings } = await getGlobals()
  const chips = [
    { icon: 'fa-solid fa-location-dot', text: job.location },
    { icon: 'fa-solid fa-briefcase', text: job.type },
    { icon: 'fa-solid fa-clock', text: job.hours },
  ].filter((chip) => chip.text)

  return (
    <>
      <header className="job-header primary-back">
        <div className="container job-header-inner">
          <a className="back-link" href={CAREERS_PATH}>
            <i aria-hidden className="fa-solid fa-arrow-left" />
            All vacancies
          </a>
          <span className="eyebrow">{job.company}</span>
          <h1>{job.title}</h1>
          <ul className="job-chips">
            {chips.map((chip) => (
              <li className="pill" key={chip.icon}>
                <i aria-hidden className={chip.icon} />
                {chip.text}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <JobApplication settings={jobSettings} job={job}>
        <p className="job-summary">{job.summary}</p>
        {!!job.duties?.length && (
          <div className="job-list">
            <h2 className="eyebrow">The role</h2>
            <ul>
              {job.duties.map((duty) => (
                <li key={duty.id}>
                  <i aria-hidden className="fa-solid fa-check" />
                  {duty.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!job.requirements?.length && (
          <div className="job-list bullets">
            <h2 className="eyebrow">About you</h2>
            <ul>
              {job.requirements.map((item) => (
                <li key={item.id}>
                  <i aria-hidden className="fa-solid fa-circle" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </JobApplication>
      <EditButton label="Edit job" target={{ collection: 'jobs', id: job.id }} />
    </>
  )
}
