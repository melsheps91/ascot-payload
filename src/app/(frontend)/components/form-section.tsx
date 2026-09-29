import type { FormSectionBlock } from '@/payload-types'
import { getGlobals } from '@/lib/payload'

import { PayloadForm } from './form/payload-form'
import { Emphasis } from './shared/heading'

// Port of inc/content/form-section.php and contact-details.php. With a heading it opens
// the page, so the heading is the page's h1.
export async function FormSection({ block, pageTitle }: { block: FormSectionBlock; pageTitle?: string }) {
  const { company } = await getGlobals()
  const phone = company.phoneNumbers?.[0]?.number
  const address = company.address?.map((line) => line.line) ?? []

  return (
    <section className="form-section-wrap primary-back" id="form">
      <div className="container form-section">
        <div className="form-section-text">
          {block.eyebrow && <span className="kicker">{block.eyebrow}</span>}
          <h1>
            <Emphasis text={block.heading || pageTitle} />
          </h1>
          {block.showContactDetails && (
            <div className="contact-details">
              {phone && (
                <div className="contact-block">
                  <span className="eyebrow">Call</span>
                  <a className="contact-phone" href={`tel:${phone.replace(/[^\d+]/g, '').replace(/^0/, '+44')}`}>
                    {phone}
                  </a>
                </div>
              )}
              {address.length > 0 && (
                <div className="contact-block">
                  <span className="eyebrow">Visit</span>
                  <address>
                    {address.slice(0, 2).join(', ')}
                    <br />
                    {address.slice(2).join(', ')}
                  </address>
                  {company.addressNote && <span className="contact-note">{company.addressNote}</span>}
                </div>
              )}
              {!!company.socialLinks?.length && (
                <div className="social">
                  {company.socialLinks.map((social) => (
                    <a
                      aria-label={social.title}
                      className="btn icon"
                      href={social.url}
                      key={social.id}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <i aria-hidden className={social.icon} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="form-card">
          <PayloadForm
            form={block.form}
            successAction={
              <a className="btn secondary small" href="">
                Send another
              </a>
            }
            title={block.formHeading}
          />
        </div>
      </div>
    </section>
  )
}
