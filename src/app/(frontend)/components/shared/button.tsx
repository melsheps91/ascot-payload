export type LinkValue = {
  label?: string | null
  url?: string | null
  newTab?: boolean | null
  style?: 'auto' | 'primary' | 'secondary' | 'text' | 'icon' | null
  icon?: string | null
} | null

const isExternal = (url: string) => /^https?:\/\//.test(url)

// Equivalent of the theme's button_field(): renders nothing when the link is empty.
// `variant` is the style used when the CMS leaves it on "Automatic".
export function Button({
  link,
  variant = 'primary',
  className,
}: {
  link?: LinkValue
  variant?: string
  className?: string
}) {
  if (!link?.url) return null

  const style = link.style && link.style !== 'auto' ? link.style : variant
  const iconOnly = style === 'icon'
  // Filled buttons and text links end in an arrow unless they have their own icon.
  const arrow = !link.icon && (style === 'primary' || style === 'text')

  return (
    <a
      aria-label={iconOnly ? (link.label ?? undefined) : undefined}
      className={['btn', style, className].filter(Boolean).join(' ')}
      href={link.url}
      rel={link.newTab ? 'noopener noreferrer' : undefined}
      target={link.newTab ? '_blank' : undefined}
      title={iconOnly ? (link.label ?? undefined) : undefined}
    >
      {link.icon && <i aria-hidden className={link.icon} />}
      {!iconOnly && link.label}
      {arrow && (
        <i
          aria-hidden
          className={`fa-solid fa-arrow-right${isExternal(link.url) ? ' external' : ''}`}
        />
      )}
    </a>
  )
}

// Equivalent of button_repeater(): the first button is primary, the rest secondary.
export function Buttons({
  items,
  field = 'button',
  className = 'buttons',
}: {
  items?: ({ id?: string | null } & Record<string, unknown>)[] | null
  field?: string
  /** null renders the buttons without a wrapper. */
  className?: string | null
}) {
  const links = (items ?? []).filter((item) => (item[field] as LinkValue)?.url)
  if (!links.length) return null

  const buttons = links.map((item, index) => (
    <Button
      key={item.id ?? index}
      link={item[field] as LinkValue}
      variant={index === 0 ? 'primary' : 'secondary'}
    />
  ))

  return className === null ? <>{buttons}</> : <div className={className}>{buttons}</div>
}
