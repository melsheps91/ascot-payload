'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavLink = { label: string; url: string; newTab?: boolean | null }

const isActive = (url: string, path: string) =>
  url === '/' ? path === '/' : path === url || path.startsWith(`${url}/`)

// The theme's header.php: logo, main menu and a contact button. The menu opens as a
// full-screen panel on small screens.
export function Header({ logo, links, cta }: { logo?: { url: string; alt: string } | null; links: NavLink[]; cta?: NavLink | null }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`main-header${open ? ' menu-open' : ''}`}>
      <div className="container header-inner">
        <a aria-label="Home" className="logo" href="/">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={logo.alt} height={56} src={logo.url} width={148} />
          ) : (
            <span className="logo-text">LOGO</span>
          )}
        </a>

        <button
          aria-controls="main-menu"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="mob-toggle"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <i aria-hidden className={open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
        </button>

        <nav aria-label="Main" className="main-menu" id="main-menu">
          <ul>
            {links.map((link) => (
              <li key={link.url}>
                <a
                  aria-current={isActive(link.url, path) ? 'page' : undefined}
                  className={isActive(link.url, path) ? 'is-active' : undefined}
                  href={link.url}
                  target={link.newTab ? '_blank' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {cta?.url && (
            <a className="header-cta" href={cta.url}>
              {cta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
