import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Content is shared across the site (header, footer, latest news, job lists), so any
// change refreshes every page. revalidatePath throws outside a Next.js request, e.g. in
// the seed script, where there is nothing to refresh anyway.
const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
