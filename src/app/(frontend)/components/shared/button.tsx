type LinkValue = {
  label?: string | null
  url?: string | null
  newTab?: boolean | null
} | null

// Equivalent of the theme's button_field(): renders nothing when the link is empty.
export function Button({ link, variant = 'primary' }: { link?: LinkValue; variant?: string }) {
  if (!link?.url) return null

  return (
    <a
      className={`btn ${variant}`}
      href={link.url}
      rel={link.newTab ? 'noopener noreferrer' : undefined}
      target={link.newTab ? '_blank' : '_self'}
      title={link.label ?? undefined}
    >
      {link.label}
    </a>
  )
}

// Equivalent of button_repeater(): the first button is primary, the rest secondary.
export function Buttons({
  items,
  field = 'button',
}: {
  items?: ({ id?: string | null } & Record<string, unknown>)[] | null
  field?: string
}) {
  if (!items?.length) return null

  return (
    <>
      {items.map((item, index) => (
        <Button
          key={item.id ?? index}
          link={item[field] as LinkValue}
          variant={index === 0 ? 'primary' : 'secondary'}
        />
      ))}
    </>
  )
}
