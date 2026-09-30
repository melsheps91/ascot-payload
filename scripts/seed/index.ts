/**
 * Seeds the site with the content from the Claude Design brief: media, pages, news,
 * jobs, testimonials, the contact and job application forms, and the site globals.
 *
 * Safe to re-run: records are matched by slug (or title/filename) and updated in place,
 * so edits made in the admin to seeded records are overwritten. Other content is untouched.
 *
 *   npm run seed
 */
import config from '@payload-config'
import path from 'path'
import { getPayload, type CollectionSlug, type Where } from 'payload'
import { fileURLToPath } from 'url'

import { h, p, paragraphs, quote, richText } from './lexical'
import { link, pages } from './pages'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const payload = await getPayload({ config })
const log = (message: string) => payload.logger.info(`seed: ${message}`)

// Create or update the first document matching `where`.
async function upsert<T extends CollectionSlug>(collection: T, where: Where, data: Record<string, unknown>) {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0 })
  const existing = docs[0] as { id: number } | undefined
  if (existing) {
    return (await payload.update({ collection, id: existing.id, data: data as never, depth: 0 })) as { id: number }
  }
  return (await payload.create({ collection, data: data as never, depth: 0 })) as { id: number }
}

async function media(file: string, alt: string) {
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.resolve(dirname, 'assets', file),
  })
  return doc.id
}

// Media ------------------------------------------------------------------------------

const m = {
  hero: await media('hero-pier.jpg', 'The Ascot Group HQ at dusk'),
  hq: await media('hq.jpg', 'The Ascot Group head office in Weston-super-Mare'),
  office: await media('office.jpg', 'The Ascot Group open-plan office'),
  people: await media('people.jpg', 'Ascot Group colleagues working together'),
}
const logo = await media('logo-white.svg', 'Ascot Group')
log('media')

// News --------------------------------------------------------------------------------

const categoryIds: Record<string, number> = {}
for (const [order, title] of ['Community', 'Andrew Scott', 'Events', 'Culture', 'Group'].entries()) {
  const slug = title.toLowerCase().replace(/\s+/g, '-')
  categoryIds[title] = (await upsert('categories', { slug: { equals: slug } }, { title, slug, order: order + 1 })).id
}

const photos = [m.hq, m.office, m.people]
const posts: {
  slug: string
  category: string
  date: string
  title: string
  excerpt: string
  content?: ReturnType<typeof richText>
}[] = [
  {
    slug: 'somewhere-to-go',
    category: 'Community',
    date: '2026-07-06',
    title: 'Ascot Group returns to support Somewhere To Go',
    excerpt:
      'Members of our team returned to Somewhere To Go, a Weston-super-Mare homelessness charity that has been transforming lives for more than 25 years.',
    content: richText(
      p('At The Ascot Group, we believe that supporting our local community is just as important as helping our clients grow. That’s why members of our team recently returned to Somewhere To Go, a Weston-super-Mare homelessness charity that has been transforming lives for more than 25 years.'),
      p('Having volunteered with the charity before, our team was delighted to spend another day giving back. Some volunteers refreshed parts of the building by painting the walls, creating a brighter and more welcoming environment. Others supported the charity’s busy shop — sorting donated clothing and household items, and organising stock ready for sale.'),
      h('Supporting Somewhere To Go'),
      p('Somewhere To Go supports people experiencing homelessness, social isolation and other complex challenges, providing a safe place to access practical support, nutritious meals, showers, clean clothing, healthcare services and advice. Its charity shop raises essential funds for these services.'),
      quote('Supporting our local community has always been an important part of who we are at Ascot Group. I’m incredibly proud of the team for giving their time to support Somewhere To Go once again.', 'Andrew Scott, CEO'),
      h('How you can help'),
      p('Whether you donate, volunteer your time, shop in their charity shop or give quality pre-loved items, every contribution makes a real difference. Visit ', { text: 'somewheretogowsm.org.uk', href: 'https://www.somewheretogowsm.org.uk/' }, ' to support their work.'),
    ),
  },
  { slug: 'mendip-challenge', category: 'Community', date: '2026-06-03', title: 'Ascot Group completes Mendip Challenge 2026 for Weston Hospicecare', excerpt: 'Walking 180 miles for Weston Hospicecare — a challenge combining breathtaking scenery, personal determination and an incredible local charity.' },
  { slug: 'spring-bbq', category: 'Culture', date: '2026-05-22', title: 'Ascot Group Spring BBQ brings the team together', excerpt: 'The team swapped thinking caps for sombreros as we came together for our annual Spring BBQ — and what a fantastic evening it was.' },
  { slug: 'somerset-chamber', category: 'Events', date: '2026-04-20', title: 'The Ascot Group at Somerset Chamber of Commerce', excerpt: 'The Chamber’s Construction Connections event in Glastonbury brought together faces from across construction and building products in the South West.' },
  { slug: 'monkey-tree', category: 'Community', date: '2026-03-31', title: 'The Ascot Group supports The Monkey Tree Charity', excerpt: 'A donation to the Bristol-based charity providing free wheelchair loans to children and young adults with terminal or life-limiting conditions.' },
  { slug: 'worlefest', category: 'Community', date: '2026-02-27', title: 'The Ascot Group sponsors WorleFest 2026', excerpt: 'We’re pleased to sponsor WorleFest 2026, the annual community fundraiser and family fun day organised by @Worle.' },
  { slug: 'jigsaw-workspace', category: 'Group', date: '2026-01-06', title: 'North Somerset businessman opens serviced office space in Weston-super-Mare', excerpt: 'Andrew Scott has opened Jigsaw Workspace, located at Junction 21 of the M5 and next to Worle mainline train station.' },
  { slug: 'guest-speaker', category: 'Andrew Scott', date: '2026-01-06', title: 'Andrew Scott receives Guest Speaker of the Year Award', excerpt: 'Andrew was awarded ‘Guest Speaker of the Year’ at the 2025 Dealmaker Awards in Richmond, London, on 12th December 2025.' },
  { slug: 'children-charity', category: 'Community', date: '2025-11-19', title: 'Children charity support this Christmas', excerpt: 'How The Ascot Group is helping local families across North Somerset this winter.' },
  {
    slug: 'tedx',
    category: 'Andrew Scott',
    date: '2025-11-12',
    title: 'Ascot Group founder Andrew Scott delivers powerful TEDx Talk',
    excerpt: 'At TEDx Bristol, Andrew delivered his talk “Purpose: The Power to Rise Again.”',
    content: richText(
      p('On 8th November 2025, Ascot Group founder and CEO Andrew Scott took to the stage at TEDx Bristol, held at We The Curious, to deliver his talk titled “Purpose: The Power to Rise Again.”'),
      p('Stepping onto the famous red circle is an extraordinary challenge. There are no notes, no autocue and no comfort monitors — every word must be rehearsed, memorised and delivered with complete authenticity.'),
      quote('The TED platform has 180 million global subscribers so the protocols are very tight. This definitely adds to the pressure, but equally makes the entire process so worthwhile.', 'Andrew Scott'),
      h('Purpose, Plan, Execute'),
      p('Andrew’s talk explored the link between purpose and overcoming adversity. Drawing on his personal journey — from growing up during the Troubles in Northern Ireland to building and leading the Ascot Group — he shared how purpose became the driving force behind resilience, leadership and long-term success.'),
      p('At the heart of the talk was Andrew’s PURPLEX model — Purpose, Plan, Execute — the framework used across the Ascot Group to align vision, strategy and action.'),
      quote('Standing on that red circle was one of the most humbling and intense experiences of my life. You don’t just deliver a talk, you share a piece of yourself.', 'Andrew Scott'),
      p('The talk was delivered in front of a live audience and broadcast across the TED platform in March 2026.'),
    ),
  },
  { slug: 'glazing-summit', category: 'Andrew Scott', date: '2025-10-10', title: 'Andrew Scott shares industry trends at 2025 Glazing Summit', excerpt: 'Andrew highlighted the key challenges and opportunities shaping the future of the UK fenestration industry.' },
  { slug: 'walk-100', category: 'Community', date: '2025-09-30', title: 'Ascot Group team to walk 100 miles in October for Breast Cancer Now', excerpt: 'Members of the team are taking on the Walk 100 Miles in October challenge to raise money for Breast Cancer Now.' },
]

for (const [i, post] of posts.entries()) {
  await upsert('posts', { slug: { equals: post.slug } }, {
    title: post.title,
    slug: post.slug,
    // Noon avoids timezone slips; minutes keep same-day articles in the brief's order.
    publishedDate: new Date(new Date(`${post.date}T12:00:00Z`).getTime() - i * 60_000).toISOString(),
    category: categoryIds[post.category],
    excerpt: post.excerpt,
    heroImage: photos[i % photos.length],
    content: post.content ?? paragraphs(post.excerpt),
  })
}
log(`${posts.length} articles`)

// Careers -----------------------------------------------------------------------------

const jobs = [
  {
    slug: 'digital-marketing-executive',
    title: 'Digital Marketing Executive',
    company: 'Purplex Marketing',
    location: 'Weston-super-Mare',
    type: 'Full-time',
    hours: 'Mon–Fri, 8:30am–5pm',
    summary: 'Join our award-nominated agency delivering digital campaigns for construction, building products and home improvement brands.',
    duties: ['Plan and deliver multi-channel campaigns across paid, social and email', 'Report on campaign performance and recommend improvements', 'Work with design, PR and web teams on integrated client work'],
    requirements: ['Experience in a digital marketing role', 'Strong written communication', 'A curious, data-led approach'],
  },
  {
    slug: 'data-researcher',
    title: 'Data Researcher',
    company: 'Insight Data',
    location: 'Weston-super-Mare',
    type: 'Full-time',
    hours: 'Mon–Fri, 8:30am–5pm',
    summary: 'Help maintain the UK’s leading construction and home improvement business data through our on-site research team.',
    duties: ['Research and verify business data by phone and online', 'Maintain accurate records within our CRM', 'Support data projects for clients across multiple industries'],
    requirements: ['Confident telephone manner', 'Attention to detail', 'Organised and self-motivated'],
  },
  {
    slug: 'content-writer',
    title: 'Content Writer',
    company: 'Building Products',
    location: 'London',
    type: 'Full-time',
    hours: 'Mon–Fri',
    summary: 'Write news, features and industry insight for one of construction’s most iconic titles.',
    duties: ['Write and edit news stories for the online portal and newswires', 'Build relationships with manufacturers and PR contacts', 'Support social media and newsletter content'],
    requirements: ['Excellent writing and editing skills', 'Interest in construction and the built environment', 'Ability to work to deadlines'],
  },
]

for (const job of jobs) {
  await upsert('jobs', { slug: { equals: job.slug } }, {
    ...job,
    status: 'open',
    duties: job.duties.map((text) => ({ text })),
    requirements: job.requirements.map((text) => ({ text })),
  })
}
log(`${jobs.length} jobs`)

const testimonialIds: Record<string, number> = {
  andrew: (
    await upsert('testimonials', { customerName: { equals: 'Andrew Scott' } }, {
      customerName: 'Andrew Scott',
      companyName: 'Group CEO & Founder',
      quote: 'We are building a world-class marketing, media and tech business right here in North Somerset. I’m looking for great people to join the Ascot family on this journey.',
    })
  ).id,
  sam: (
    await upsert('testimonials', { customerName: { equals: 'Sam' } }, {
      customerName: 'Sam',
      companyName: 'Purplex Marketing',
      quote: 'Most people think they must commute to Bristol to work for a company that’s going places, but the Ascot Group is proof that you don’t. I joined 10 years ago and am now responsible for developing multi-channel marketing strategies for some of our largest clients.',
    })
  ).id,
  jade: (
    await upsert('testimonials', { customerName: { equals: 'Jade' } }, {
      customerName: 'Jade',
      companyName: 'Insight Data',
      quote: 'The opportunities to progress at the Ascot Group are incredible. I came here as a researcher and have since grown to become the Operations Director of Insight Data at the age of 28.',
    })
  ).id,
}
log('testimonials')

// Forms -------------------------------------------------------------------------------

const privacyNote = (prefix: string) =>
  richText(p(`${prefix} `, { text: 'privacy statement', href: '/terms-and-privacy' }, '.'))

const contactForm = await upsert('forms', { title: { equals: 'Contact' } }, {
  title: 'Contact',
  submitButtonLabel: 'Send message',
  confirmationType: 'message',
  confirmationMessage: richText(h('Thank you.', 'h3'), p('We’ve received your message and a member of the team will be in touch shortly.')),
  fields: [
    {
      blockType: 'radio',
      name: 'topic',
      label: '',
      defaultValue: 'General enquiry',
      options: ['General enquiry', 'Careers', 'Acquisitions', 'Press'].map((label) => ({ label, value: label })),
    },
    { blockType: 'text', name: 'fullName', label: 'Full name', required: true, width: 50 },
    { blockType: 'text', name: 'company', label: 'Company', width: 50 },
    { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
    { blockType: 'text', name: 'phone', label: 'Phone', width: 50 },
    { blockType: 'textarea', name: 'message', label: 'How can we help?', required: true },
    { blockType: 'checkbox', name: 'marketing', label: 'I’d like to receive marketing communications about The Ascot Group’s products, services and events.' },
    { blockType: 'message', message: privacyNote('By submitting you agree to the storing and processing of your data as described in our') },
  ],
})

const applicationForm = await upsert('forms', { title: { equals: 'Job application' } }, {
  title: 'Job application',
  submitButtonLabel: 'Submit application',
  confirmationType: 'message',
  confirmationMessage: richText(h('Application received.', 'h3'), p('Thank you for applying. Our team will review your application and be in touch.')),
  fields: [
    { blockType: 'text', name: 'firstName', label: 'First name', required: true, width: 50 },
    { blockType: 'text', name: 'lastName', label: 'Last name', required: true, width: 50 },
    { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
    { blockType: 'text', name: 'phone', label: 'Phone', required: true, width: 50 },
    {
      blockType: 'select',
      name: 'status',
      label: 'What is your current status?',
      required: true,
      options: [
        'In work, seeking a new role',
        'Out of work, seeking a new role',
        'Returning to work after a break',
        'Seeking a change of career/new direction',
        'Recently graduated/finished education',
        'Currently in education, seeking a future role',
      ].map((label) => ({ label, value: label })),
    },
    {
      blockType: 'radio',
      name: 'experience',
      label: 'Relevant experience for this role',
      required: true,
      options: ['None', 'Basic understanding', 'Fairly experienced', 'Expert level'].map((label) => ({ label, value: label })),
    },
    {
      blockType: 'upload',
      name: 'cv',
      label: 'Upload your CV',
      uploadCollection: 'cvs',
      mimeTypes: [
        { mimeType: 'application/pdf' },
        { mimeType: 'application/msword' },
        { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      ],
      maxFileSize: 10_000_000,
      required: true,
    },
    { blockType: 'textarea', name: 'about', label: 'Tell us a little about yourself (optional)' },
    { blockType: 'checkbox', name: 'marketing', label: 'Yes, I would like to receive marketing communications regarding The Ascot Group products, services and events.' },
    {
      blockType: 'checkbox',
      name: 'consent',
      required: true,
      label: 'I understand the information I provide, including my CV, will be stored for 12 months and may be used to assess current or future roles.',
    },
    { blockType: 'message', message: privacyNote('By submitting you agree to the storing and processing of your personal data as described in our') },
  ],
})
log('forms')

// Globals -----------------------------------------------------------------------------

await payload.updateGlobal({
  slug: 'companyDetails',
  data: {
    companyName: 'The Ascot Group',
    regNumber: '08070933',
    address: ['Unit 200', 'Worle Park Way', 'Weston-super-Mare', 'BS22 6WA'].map((line) => ({ line })),
    addressNote: 'Adjacent to junction 21 of the M5 and Worle mainline station.',
    phoneNumbers: [{ number: '01934 428 771' }],
    emailAddresses: [{ email: 'business@ascotgroup.co.uk' }],
    socialLinks: [
      { title: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', url: 'https://www.linkedin.com/company/the-ascot-group/' },
      { title: 'X', icon: 'fa-brands fa-x-twitter', url: 'https://twitter.com/TheAscotGroup' },
      { title: 'Facebook', icon: 'fa-brands fa-facebook-f', url: 'https://en-gb.facebook.com/AscotGroupUK/' },
    ],
  },
})

const nav = [
  ['Home', '/'],
  ['The Ascot Group', '/the-ascot-group'],
  ['Portfolio', '/portfolio'],
  ['Andrew Scott', '/andrew-scott'],
  ['Community', '/community'],
  ['Careers', '/careers'],
  ['News', '/news'],
] as const

await payload.updateGlobal({
  slug: 'header',
  data: {
    logo,
    navItems: nav.map(([label, url]) => ({ link: link(label, url) })),
    cta: link('Contact', '/contact'),
  },
})

await payload.updateGlobal({
  slug: 'footer',
  data: {
    logo,
    menuHeading: 'Information',
    addressHeading: 'Address',
    contactHeading: 'Get in touch',
    menu: [
      ...nav.map(([label, url]) => [label === 'Andrew Scott' ? 'About Andrew' : label, url]),
      ['Acquisitions', '/acquisitions'],
      ['Contact', '/contact'],
    ].map(([label, url]) => ({ link: link(label, url) })),
    legalLinks: [
      { link: link('Website terms & privacy policy', '/terms-and-privacy') },
      { link: link('Cookie policy', '/cookie-policy') },
    ],
    copyright: '© Copyright {year} {company}',
  },
})

await payload.updateGlobal({
  slug: 'jobSettings',
  data: {
    applicationForm: applicationForm.id,
    why: {
      heading: 'Why the Ascot Group?',
      text: 'A family-like culture built on integrity, humility, respect and fairness — with on-site parking, EV charging, early finish Fridays and regular social events. #WorkLocal',
      link: link('Life at Ascot', '/careers'),
    },
    general: {
      heading: 'Apply for *other roles.*',
      text: 'If you have the right skills — and more importantly the right attitude — tell us a little about yourself and send your CV. Not all vacancies are listed, and we keep applications on file for 12 months.',
    },
  },
})
log('globals')

// Pages -------------------------------------------------------------------------------

for (const page of pages(m, { contact: contactForm.id })) {
  const layout = page.layout.map((block) =>
    block.blockType === 'testimonials' && 'testimonials' in block
      ? { ...block, testimonials: (block.testimonials as string[]).map((key) => testimonialIds[key]) }
      : block,
  )
  await upsert('pages', { slug: { equals: page.slug } }, { ...page, layout, generateSlug: false })
}
log('pages')

log('done')
process.exit(0)
