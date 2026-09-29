// URLs of the pages the collection templates link back to.
export const HOME_SLUG = 'home'
export const NEWS_PATH = '/news'
export const CAREERS_PATH = '/careers'
export const APPLY_PATH = '/careers/apply'

export const pagePath = (slug: string) => (slug === HOME_SLUG ? '/' : `/${slug}`)
export const postPath = (slug?: string | null) => `${NEWS_PATH}/${slug}`
export const jobPath = (slug?: string | null) => `${CAREERS_PATH}/${slug}`

export const formatDate = (date?: string | null) =>
  date
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(date),
      )
    : ''
