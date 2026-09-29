// Purplex mark, shown top-left in the admin (the link back to the dashboard).
export function Icon() {
  return (
    <span className="plx-icon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Purplex" className="plx-on-light" height={28} src="/admin/purplex-icon.svg" width={28} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Purplex" className="plx-on-dark" height={28} src="/admin/purplex-icon-white.svg" width={28} />
    </span>
  )
}
