import type { CompanyDetail, Footer as FooterGlobal } from '@/payload-types'

import { asMedia, Img } from '../shared/media'

const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, '').replace(/^0/, '+44')}`

// The theme's footer.php, with its content from the Footer and Company Details globals.
export function Footer({ footer, company }: { footer: FooterGlobal; company: CompanyDetail }) {
  const logo = asMedia(footer.logo)
  const phone = company.phoneNumbers?.[0]?.number
  const copyright = (footer.copyright ?? '')
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{company}', company.companyName ?? '')

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={logo.alt} className="footer-logo" height={64} src={logo.url!} width={170} />
            )}
            {footer.badge && (
              <div className="footer-badge">
                <Img fit="contain" image={footer.badge} sizes="120px" />
              </div>
            )}
          </div>

          {!!footer.menu?.length && (
            <nav aria-label="Footer" className="footer-col">
              <span className="footer-heading">{footer.menuHeading}</span>
              <ul>
                {footer.menu.map((item) => (
                  <li key={item.id}>
                    <a href={item.link.url!}>{item.link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {!!company.address?.length && (
            <div className="footer-col">
              <span className="footer-heading">{footer.addressHeading}</span>
              <address>
                {company.address.map((line) => (
                  <span key={line.id}>{line.line}</span>
                ))}
              </address>
            </div>
          )}

          <div className="footer-col">
            <span className="footer-heading">{footer.contactHeading}</span>
            {phone && (
              <a className="footer-phone" href={telHref(phone)}>
                {phone}
              </a>
            )}
            {!!company.socialLinks?.length && (
              <div className="social">
                {company.socialLinks.map((social) => (
                  <a aria-label={social.title} href={social.url} key={social.id} rel="noopener noreferrer" target="_blank">
                    <i aria-hidden className={social.icon} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {copyright}
            {company.regNumber && ` · Company no. ${company.regNumber}`}
          </span>
          {!!footer.legalLinks?.length && (
            <ul>
              {footer.legalLinks.map((item) => (
                <li key={item.id}>
                  <a href={item.link.url!}>{item.link.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
