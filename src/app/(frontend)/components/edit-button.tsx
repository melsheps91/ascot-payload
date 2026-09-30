'use client'

import { useEffect, useState } from 'react'

type Target =
  | { collection: 'pages' | 'posts' | 'jobs'; id: number | string }
  | { global: 'jobSettings' | 'header' | 'footer' | 'companyDetails' }

const ADMIN = '/admin'

// Floating "Edit" button for logged-in admin users. Pages are cached and shared, so
// the login check runs in the browser: visitors never see it, and it never ends up in
// the cached HTML.
export function EditButton({ target, label = 'Edit page' }: { target: Target; label?: string }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => !cancelled && setLoggedIn(Boolean(json?.user)))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!loggedIn) return null

  const href =
    'collection' in target
      ? `${ADMIN}/collections/${target.collection}/${target.id}`
      : `${ADMIN}/globals/${target.global}`

  return (
    <div className="edit-bar" role="region" aria-label="Admin">
      <a className="edit-bar-edit" href={href}>
        <i aria-hidden className="fa-solid fa-pen" />
        {label}
      </a>
      <a aria-label="Admin dashboard" className="edit-bar-admin" href={ADMIN} title="Admin dashboard">
        <i aria-hidden className="fa-solid fa-gauge" />
      </a>
    </div>
  )
}
