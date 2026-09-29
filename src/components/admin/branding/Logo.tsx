// Purplex logo on the login and account screens. Both colourways render; custom.scss
// shows the one that suits the admin's light or dark theme.
export function Logo() {
  return (
    <span className="plx-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Purplex" className="plx-on-light" height={78} src="/admin/purplex-logo.svg" width={318} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Purplex" className="plx-on-dark" height={78} src="/admin/purplex-logo-white.svg" width={318} />
    </span>
  )
}
