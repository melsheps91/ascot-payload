// "View website" at the foot of the sidebar menu.
export function ViewSiteLink() {
  return (
    <a className="plx-view-site" href="/" rel="noopener" target="_blank">
      View website
      <svg aria-hidden fill="none" height="14" viewBox="0 0 24 24" width="14">
        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    </a>
  )
}
