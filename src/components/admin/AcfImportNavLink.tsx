'use client'

import { NavGroup, useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Sidebar entry for /admin/acf-import, using the same classes as Payload's own nav links.
export function AcfImportNavLink() {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const href = `${admin}/acf-import`
  const active = pathname === href

  return (
    <NavGroup label="Tools">
      <Link className="nav__link" href={href} id="nav-acf-import" prefetch={false}>
        {active && <div className="nav__link-indicator" />}
        <span className="nav__link-label">ACF importer</span>
      </Link>
    </NavGroup>
  )
}
