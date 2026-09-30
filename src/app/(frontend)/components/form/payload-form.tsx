import type { ReactNode } from 'react'

import type { Form, Page } from '@/payload-types'
import { pagePath } from '@/lib/routes'

import { RichText } from '../shared/rich-text'
import { FormClient } from './form-client'

// Renders a Form Builder form. Rich text (message fields and the confirmation) is
// rendered here on the server and handed to the client component as ready-made nodes.
export function PayloadForm({
  form,
  title,
  subtitle,
  jobId,
  onDark,
  successAction,
}: {
  form?: number | Form | null
  title?: string | null
  subtitle?: string | null
  /** Links the submission to a job (job applications). */
  jobId?: number
  onDark?: boolean
  successAction?: ReactNode
}) {
  if (!form || typeof form !== 'object') return null

  const messages: Record<number, ReactNode> = {}
  form.fields?.forEach((field, i) => {
    if (field.blockType === 'message') {
      messages[i] = <RichText className="form-message" data={field.message} />
    }
  })

  let redirect: string | undefined
  if (form.confirmationType === 'redirect' && form.redirect) {
    const ref = form.redirect.reference?.value
    redirect =
      form.redirect.type === 'reference' && ref && typeof ref === 'object'
        ? pagePath((ref as Page).slug)
        : (form.redirect.url ?? undefined)
  }

  return (
    <FormClient
      confirmation={<RichText data={form.confirmationMessage} />}
      fields={form.fields ?? []}
      formId={form.id}
      jobId={jobId}
      messages={messages}
      onDark={onDark}
      redirect={redirect}
      submitLabel={form.submitButtonLabel || 'Submit'}
      subtitle={subtitle}
      successAction={successAction}
      title={title}
    />
  )
}
