'use client'

import { useId, useMemo, useState } from 'react'

type Job = { id: number; title: string; company: string; location: string; href: string }

// Keyword and location filters over the open vacancies.
export function JobsFilter({ jobs, emptyText }: { jobs: Job[]; emptyText: string }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('all')
  const id = useId()

  const locations = useMemo(() => [...new Set(jobs.map((job) => job.location))].sort(), [jobs])

  const q = query.trim().toLowerCase()
  const matches = jobs.filter(
    (job) =>
      (location === 'all' || job.location === location) &&
      (!q || `${job.title} ${job.company}`.toLowerCase().includes(q)),
  )

  return (
    <>
      <div className="jobs-filter form" role="search">
        <label className="visually-hidden" htmlFor={`${id}-q`}>
          Keywords
        </label>
        <input
          id={`${id}-q`}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keywords"
          type="search"
          value={query}
        />
        <label className="visually-hidden" htmlFor={`${id}-loc`}>
          Location
        </label>
        <select id={`${id}-loc`} onChange={(e) => setLocation(e.target.value)} value={location}>
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <ul aria-live="polite" className="jobs">
        {matches.map((job) => (
          <li key={job.id}>
            <a className="job" href={job.href}>
              <span className="job-title">{job.title}</span>
              <span className="job-meta">{job.company}</span>
              <span className="job-meta">{job.location}</span>
              <span aria-hidden className="job-arrow">
                <i className="fa-solid fa-arrow-right" />
              </span>
            </a>
          </li>
        ))}
        {!matches.length && <li className="jobs-empty">{emptyText}</li>}
      </ul>
    </>
  )
}
