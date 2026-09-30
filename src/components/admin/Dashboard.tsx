import Link from 'next/link'
import type { ServerProps } from 'payload'

const WEEK = 7 * 24 * 60 * 60 * 1000

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date()),
  )
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
}

const firstName = (email?: string) => {
  const name = email?.split('@')[0]?.split(/[._-]/)[0]
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(date),
  )

// Shown above Payload's collection cards: quick actions for the common editing jobs,
// a snapshot of the site and the latest form submissions.
export async function Dashboard({ payload, user }: ServerProps) {
  const admin = payload.config.routes.admin
  const since = new Date(Date.now() - WEEK).toISOString()

  const [home, openJobs, articles, newSubmissions, recent] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0, select: {} }),
    payload.count({ collection: 'jobs', where: { status: { equals: 'open' } } }),
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'form-submissions', where: { createdAt: { greater_than: since } } }),
    payload.find({
      collection: 'form-submissions',
      sort: '-createdAt',
      limit: 5,
      depth: 1,
      select: { form: true, job: true, createdAt: true },
    }),
  ])

  const homeId = home.docs[0]?.id
  const actions = [
    {
      label: 'Edit the homepage',
      text: 'Hero, stats, sections',
      href: homeId ? `${admin}/collections/pages/${homeId}` : `${admin}/collections/pages`,
    },
    { label: 'Write a news article', text: 'Appears on /news', href: `${admin}/collections/posts/create` },
    { label: 'Post a job', text: 'Listed on /careers', href: `${admin}/collections/jobs/create` },
    { label: 'Add a page', text: 'Build it from blocks', href: `${admin}/collections/pages/create` },
    { label: 'Upload images', text: 'Photos, logos, videos', href: `${admin}/collections/media/create` },
    { label: 'Contact details', text: 'Phone, address, socials', href: `${admin}/globals/companyDetails` },
  ]

  const stats = [
    { value: newSubmissions.totalDocs, label: 'Enquiries & applications this week', href: `${admin}/collections/form-submissions` },
    { value: openJobs.totalDocs, label: 'Open vacancies', href: `${admin}/collections/jobs` },
    { value: articles.totalDocs, label: 'News articles', href: `${admin}/collections/posts` },
  ]

  return (
    <div className="plx-dashboard">
      <div className="plx-welcome">
        <div>
          <h1>
            {greeting()}
            {firstName(user?.email) && `, ${firstName(user?.email)}`}.
          </h1>
          <p>What would you like to do today?</p>
        </div>
        <a className="plx-button" href="/" rel="noopener" target="_blank">
          View website ↗
        </a>
      </div>

      <div className="plx-actions">
        {actions.map((action) => (
          <Link className="plx-action" href={action.href} key={action.label} prefetch={false}>
            <span className="plx-action-label">{action.label}</span>
            <span className="plx-action-text">{action.text}</span>
            <span aria-hidden className="plx-action-arrow">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="plx-panels">
        <div className="plx-stats">
          {stats.map((stat) => (
            <Link className="plx-stat" href={stat.href} key={stat.label} prefetch={false}>
              <span className="plx-stat-value">{stat.value}</span>
              <span className="plx-stat-label">{stat.label}</span>
            </Link>
          ))}
        </div>

        <div className="plx-panel">
          <div className="plx-panel-head">
            <h2>Latest submissions</h2>
            <Link href={`${admin}/collections/form-submissions`} prefetch={false}>
              View all
            </Link>
          </div>
          {recent.docs.length ? (
            <ul className="plx-list">
              {recent.docs.map((submission) => {
                const form = typeof submission.form === 'object' ? submission.form.title : 'Form'
                const job = submission.job && typeof submission.job === 'object' ? submission.job.title : null
                return (
                  <li key={submission.id}>
                    <Link href={`${admin}/collections/form-submissions/${submission.id}`} prefetch={false}>
                      <span>{job ? `${form}: ${job}` : form}</span>
                      <time dateTime={submission.createdAt}>{formatDate(submission.createdAt)}</time>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="plx-empty">No submissions yet.</p>
          )}
        </div>

        <div className="plx-panel plx-tips">
          <h2>Editing tips</h2>
          <ul>
            <li>
              In headings, wrap words in <code>*asterisks*</code> to make them <strong>bold</strong>.
            </li>
            <li>
              Pages are built from sections. Use <em>Add Section</em> at the bottom of a page, and drag sections to
              reorder them.
            </li>
            <li>
              Each section has <em>Section settings</em> for its background colour. Sections on the same background sit
              closer together.
            </li>
            <li>
              Use <em>Preview</em> at the top of a page, article or job to see it on the website.
            </li>
            <li>Give every image a short description (alt text). It helps screen readers and search engines.</li>
            <li>
              If an image is cropped badly, open it in <em>Images &amp; files</em> and click the part that should stay in
              view (the focal point). Page headers also have an <em>Image Position</em> setting.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
