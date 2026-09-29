import type { ReactNode } from 'react'

import type { Job, JobSetting } from '@/payload-types'
import { CAREERS_PATH } from '@/lib/routes'

import { PayloadForm } from '../components/form/payload-form'
import { Autop } from '../components/shared/autop'
import { Button } from '../components/shared/button'

// The two-column body of a job page: role details and the "why join" panel on the left,
// the sticky application form on the right.
export function JobApplication({
  settings,
  job,
  children,
}: {
  settings: JobSetting
  job?: Job
  children: ReactNode
}) {
  const { why } = settings

  return (
    <section className="job-body-wrap med-pad">
      <div className="container job-body">
        <div className="job-details">
          {children}
          {(why?.heading || why?.text) && (
            <div className="job-why">
              {why.heading && <h2>{why.heading}</h2>}
              <Autop text={why.text} />
              <Button link={why.link ? { ...why.link, style: 'text' } : null} />
            </div>
          )}
        </div>
        <div className="apply-panel primary-back" id="apply">
          <PayloadForm
            form={settings.applicationForm}
            jobId={job?.id}
            onDark
            subtitle={job ? `${job.title} · ${job.company}` : null}
            successAction={
              <a className="btn secondary small" href={CAREERS_PATH}>
                Back to vacancies
              </a>
            }
            title={job ? 'Apply for this role' : 'Send us your CV'}
          />
        </div>
      </div>
    </section>
  )
}
