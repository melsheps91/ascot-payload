import type { Metadata } from 'next'

import { getGlobals } from '@/lib/payload'
import { CAREERS_PATH } from '@/lib/routes'

import { Autop } from '../../components/shared/autop'
import { Emphasis } from '../../components/shared/heading'
import { EditButton } from '../../components/edit-button'
import { JobApplication } from '../job-application'

export const metadata: Metadata = {
  title: 'Apply for other roles',
}

// Speculative applications ("Apply for other role" on the careers page).
export default async function ApplyPage() {
  const { jobSettings } = await getGlobals()

  return (
    <>
      <header className="job-header primary-back">
        <div className="container job-header-inner">
          <a className="back-link" href={CAREERS_PATH}>
            <i aria-hidden className="fa-solid fa-arrow-left" />
            All vacancies
          </a>
          <span className="eyebrow">Careers</span>
          <h1>
            <Emphasis text={jobSettings.general?.heading || 'Apply for *other roles.*'} />
          </h1>
        </div>
      </header>

      <JobApplication settings={jobSettings}>
        {jobSettings.general?.text && (
          <div className="job-summary">
            <Autop text={jobSettings.general.text} />
          </div>
        )}
      </JobApplication>
      <EditButton label="Edit page" target={{ global: 'jobSettings' }} />
    </>
  )
}
