import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { getGlobals } from '@/lib/payload'

import { Footer } from './components/layout/footer'
import { Header } from './components/layout/header'
import { asMedia } from './components/shared/media'
import './scss/main.scss'

// Rendered on every request: the DigitalOcean build has no database or PAYLOAD_SECRET,
// so nothing here may query Payload at build time. Segment config is per file, so each
// page sets this itself (see .claude/skills/pre-deploy-check).
export const dynamic = 'force-dynamic'

// The redesign sets everything in Montserrat, from 200 (display) to 500 (emphasis).
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-primary',
})

export const metadata = {
  title: {
    default: 'The Ascot Group',
    template: '%s | The Ascot Group',
  },
  description: "The UK's leading marketing group for the construction and built environment.",
}

// Font Awesome Pro kit (CSS mode) shared with CleanBuildPro. The kit must allow this domain.
const FONT_AWESOME_KIT = process.env.NEXT_PUBLIC_FONT_AWESOME_KIT || '4ff287f21b'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { header, footer, company } = await getGlobals()
  const logo = asMedia(header.logo)

  return (
    <html className={montserrat.variable} lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header
          cta={header.cta?.url ? { label: header.cta.label ?? '', url: header.cta.url } : null}
          links={(header.navItems ?? [])
            .filter((item) => item.link.url)
            .map((item) => ({ label: item.link.label ?? '', url: item.link.url!, newTab: item.link.newTab }))}
          logo={logo ? { url: logo.url!, alt: logo.alt } : null}
        />
        <main id="main">{children}</main>
        <Footer company={company} footer={footer} />
        <Script crossOrigin="anonymous" src={`https://kit.fontawesome.com/${FONT_AWESOME_KIT}.js`} strategy="beforeInteractive" />
      </body>
    </html>
  )
}
