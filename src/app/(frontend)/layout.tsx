import { Montserrat, Roboto } from 'next/font/google'
import React from 'react'
import './theme.css'
import './styles.css'

// Same families and weights CleanBuildPro enqueues in site-enqueue.php.
const primary = Roboto({ subsets: ['latin'], weight: '300', variable: '--font-primary' })
const secondary = Montserrat({ subsets: ['latin'], weight: '600', variable: '--font-secondary' })

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html className={`${primary.variable} ${secondary.variable}`} lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
