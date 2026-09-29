// Page content from the Claude Design brief ("Homepage redesign brief").
import { p, paragraphs, richText } from './lexical'

export type MediaIds = {
  hero: number
  hq: number
  office: number
  people: number
}

type LinkOptions = { style?: 'auto' | 'primary' | 'secondary' | 'text' | 'icon'; icon?: string; newTab?: boolean }

export const link = (label: string, url: string, { style = 'auto', icon, newTab }: LinkOptions = {}) => ({
  label,
  url,
  style,
  icon,
  newTab: newTab ?? /^https?:/.test(url),
})

const button = (label: string, url: string, options?: LinkOptions) => ({ button: link(label, url, options) })

const LINKEDIN = 'https://www.linkedin.com/company/the-ascot-group/'
const TWITTER = 'https://twitter.com/TheAscotGroup'

export const pages = (m: MediaIds, forms: { contact: number }) => [
  {
    title: 'Home',
    slug: 'home',
    meta: {
      title: 'The Ascot Group | The Construction Marketing Group',
      description:
        "The UK's leading marketing group for the construction, building products, home improvement, property and sustainability sectors.",
    },
    layout: [
      {
        blockType: 'banner',
        variant: 'home',
        preHeading: 'The Construction Marketing Group',
        heading: 'Fast paced, dynamic *&* ambitious.',
        type: 'image',
        images: [m.hero],
        stats: [
          { value: '20+', label: 'Years of industry knowledge' },
          { value: '80+', label: 'Experienced employees' },
          { value: '4', label: 'Specialist brands' },
        ],
        scrollLink: link('Discover the Group', '#about'),
      },
      {
        blockType: 'ticker',
        duration: 40,
        items: ['Construction', 'Building Products', 'Home Improvement', 'Property', 'Sustainability', 'Marketing', 'Data', 'Technology', 'Media'].map(
          (label) => ({ label }),
        ),
      },
      {
        blockType: 'introContent',
        layout: 'split',
        anchor: 'about',
        eyebrow: '01 — Who we are',
        heading: "The UK's leading marketing group for the construction and *built environment.*",
        content: paragraphs(
          'Founded by award-winning entrepreneur Andrew Scott, the Ascot Group specialises in the construction, building products, home improvement, property and sustainability sectors.',
          "Today the Group combines 20+ years' industry knowledge with cutting-edge marketing, data, technology and media solutions — operating from a state-of-the-art freehold HQ near Bristol and employing 80+ experienced people.",
        ),
        buttons: [button('About the Group', '/the-ascot-group', { style: 'text' })],
        headingLinks: [
          button('/AscotGroup', LINKEDIN, { style: 'secondary', icon: 'fa-brands fa-linkedin-in' }),
          button('@TheAscotGroup', TWITTER, { style: 'secondary', icon: 'fa-brands fa-x-twitter' }),
        ],
      },
      {
        blockType: 'productCardsManual',
        cards: [
          {
            tag: 'The Group',
            heading: 'Our companies',
            text: 'Discover the Ascot Group and our subsidiary companies and brands.',
            image: m.hq,
            link: link('The Ascot Group', '/the-ascot-group'),
          },
          {
            tag: 'Founder & CEO',
            heading: 'Andrew Scott',
            text: 'Learn more about the Ascot Group founder and CEO.',
            link: link('Andrew Scott', '/andrew-scott'),
          },
          {
            tag: 'Careers',
            heading: 'Join the team',
            text: 'We are recruiting talented, passionate people to join our business.',
            image: m.people,
            link: link('Careers', '/careers'),
          },
        ],
      },
      {
        blockType: 'iconGrid',
        theme: 'dark',
        style: 'bordered',
        numbered: true,
        introEyebrow: '02 — Portfolio',
        introHeading: 'Ascot Group *Brands*',
        introButton: link('View portfolio', '/portfolio', { style: 'secondary' }),
        grid: [
          { heading: 'Purplex', text: 'Construction marketing agency.', link: link('', 'https://www.purplexmarketing.com/') },
          { heading: 'insightdata', text: 'Construction industry data and insight.', link: link('', 'https://www.insightdata.co.uk/') },
          { heading: 'EDGE', text: 'Construction project intelligence, by insightdata.', link: link('', '/portfolio') },
          { heading: 'Building Products', text: 'News and media for the building products sector.', link: link('', 'https://www.buildingproducts.co.uk/') },
        ],
      },
      {
        blockType: 'introContent',
        layout: 'split',
        heading: 'Build your career *with us.*',
        content: paragraphs(
          "We're recruiting talented, passionate people across marketing, data, technology and media to join our Weston-super-Mare HQ.",
        ),
        buttons: [button('View vacancies', '/careers#vacancies'), button('Life at Ascot', '/careers')],
        image: m.office,
      },
    ],
  },

  {
    title: 'The Ascot Group',
    slug: 'the-ascot-group',
    meta: { description: 'From a dining room table in 2004 to a multi-million turnover group with 80+ employees.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'large',
        preHeading: 'The Ascot Group',
        heading: 'It all started in 2004 from a *dining room table.*',
        text: 'Over the last 20 years the Ascot Group has grown into a multi-million turnover group with 80+ employees and operations in marketing, CRM software, business data and media.',
        type: 'image',
        images: [m.hq],
      },
      {
        blockType: 'timeline',
        eyebrow: '01 — Our story',
        heading: 'Still very much a *family business.*',
        content: richText(
          p(
            'Privately owned by founder and CEO ',
            { text: 'Andrew Scott', href: '/andrew-scott' },
            ', the Group operates from dedicated offices near Bristol, adjacent to junction 21 of the M5 and Worle mainline train station.',
          ),
        ),
        items: [
          { year: '2004', title: 'Purplex is born', text: 'Andrew Scott launches his business and marketing consultancy, Purplex, with a dream of building a world-class business.' },
          { year: '2007', title: 'The first office', text: 'An office above an estate agent — and the first employee.' },
          { year: '2012', title: 'The Group is formalised', text: 'Ascot Group (Holdings) Ltd is incorporated as a holding company.' },
          { year: '2023', title: 'A strategic review', text: 'Business Leader Ltd is acquired by Richard Harpin’s Growth Partner, and the conference venture is sold to the Mark Allen Group.' },
          { year: 'Today', title: 'Focused on construction', text: '80+ employees across marketing, CRM software, business data and media — all focused on the built environment.' },
        ],
      },
      {
        blockType: 'repeaterContent',
        theme: 'dark',
        firstImageSide: 'left',
        rows: [
          {
            eyebrow: '02 — Our mission',
            heading: 'Helping companies grow across the *built environment.*',
            content: paragraphs('Our core focus is the construction, building products, home improvement, property and low-carbon sectors.'),
            tags: ['Construction', 'Building products', 'Home improvement', 'Property', 'Low-carbon'].map((label) => ({ label })),
            mediaType: 'image',
            images: [m.office],
          },
        ],
      },
      {
        blockType: 'iconGrid',
        style: 'cards',
        numbered: true,
        introHeading: 'Explore *the Group*',
        grid: [
          { heading: 'Portfolio', text: 'Our market-leading businesses and brands.', link: link('', '/portfolio') },
          { heading: 'Community', text: 'Charity, CSR and our environmental commitments.', link: link('', '/community') },
          { heading: 'Acquisitions', text: 'Thinking of exiting your business? Talk to us.', link: link('', '/acquisitions') },
        ],
      },
    ],
  },

  {
    title: 'Portfolio',
    slug: 'portfolio',
    meta: { description: 'Purplex Marketing, Insight Data and Building Products: the Ascot Group businesses.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'large',
        preHeading: 'Portfolio',
        heading: 'Ascot Group business *operations.*',
        text: 'Each business within the Group is a market leader in its field and committed to our ethos of ‘world class’ — an eco-system where each company’s specialist skills propel the others.',
        type: 'image',
        images: [m.office],
      },
      {
        blockType: 'repeaterContent',
        firstImageSide: 'left',
        rows: [
          {
            eyebrow: '01 — Marketing',
            heading: 'Purplex Marketing Ltd',
            content: paragraphs(
              'Nominated as CMA Marketing Agency of the Year in 2015, 2016 and 2019, Purplex is a full-service PR and digital marketing agency working with SMEs and blue-chip corporations across the UK and Europe, with specialist teams in construction, building products, home improvements and professional services.',
            ),
            tags: ['Advertising, design & branding', 'PR & media relations', 'Web design & development', 'Digital (PPC / SEO / CRO)', 'Direct marketing & lead gen', 'Video, film & photography'].map((label) => ({ label })),
            buttons: [
              button('purplexmarketing.com', 'https://www.purplexmarketing.com/', { style: 'primary' }),
              button('01934 808132', 'tel:+441934808132', { style: 'secondary', icon: 'fa-solid fa-phone' }),
            ],
            mediaType: 'image',
            images: [m.hq],
          },
          {
            eyebrow: '02 — Data & software',
            heading: 'Insight Data Ltd',
            content: paragraphs(
              'ICO registered, Insight is an award-winning market research company and supplier of business data for the construction and home improvement industries, with an on-site call centre making over 20,000 B2B calls per month. It has also developed Salestracker, a cloud CRM with 700+ users across Europe, and STEM, an integrated email marketing solution.',
            ),
            tags: ['Business data', 'Market research', 'Data management', 'Salestracker CRM', 'STEM email marketing'].map((label) => ({ label })),
            buttons: [
              button('insightdata.co.uk', 'https://www.insightdata.co.uk/', { style: 'primary' }),
              button('01934 808293', 'tel:+441934808293', { style: 'secondary', icon: 'fa-solid fa-phone' }),
            ],
            mediaType: 'image',
            images: [m.office],
          },
          {
            eyebrow: '03 — Media',
            heading: 'Building Products',
            content: paragraphs(
              'This iconic construction industry magazine launched in 1977 and was once part of Robert Maxwell’s media empire. Today it sits at the heart of the Group as an online news portal, weekly newswires delivered to over 80,000 recipients, social media coverage and a supplier directory.',
            ),
            tags: ['Online news portal', 'Weekly newswires', 'Social media', 'Supplier directory'].map((label) => ({ label })),
            buttons: [
              button('buildingproducts.co.uk', 'https://www.buildingproducts.co.uk/', { style: 'primary' }),
              button('020 3096 2861', 'tel:+442030962861', { style: 'secondary', icon: 'fa-solid fa-phone' }),
            ],
            mediaType: 'image',
            images: [],
          },
        ],
      },
      {
        blockType: 'logoGrid',
        theme: 'dark',
        introEyebrow: 'Trusted by',
        introHeading: 'Some of the companies *we’ve worked with*',
        logos: ['SEH BAC', 'Edgetech', 'Almeda', 'Inspire', 'Caldwell', 'Reddish Joinery'].map((name) => ({ name })),
      },
    ],
  },

  {
    title: 'Andrew Scott',
    slug: 'andrew-scott',
    meta: { description: 'Ascot Group founder and CEO Andrew Scott: award-winning entrepreneur, advisor and key-note speaker.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'split',
        preHeading: 'Founder & CEO',
        heading: 'Andrew *Scott*',
        text: 'An award-winning entrepreneur, advisor and key-note speaker.',
        type: 'image',
        images: [],
        buttons: [
          button('AndrewScott.bio', 'http://www.andrewscott.bio', { style: 'primary' }),
          button('LinkedIn', 'https://www.linkedin.com/in/andrewscottgb/', { style: 'icon', icon: 'fa-brands fa-linkedin-in' }),
          button('X', 'https://twitter.com/AndrewScottGB', { style: 'icon', icon: 'fa-brands fa-x-twitter' }),
        ],
      },
      {
        blockType: 'iconGrid',
        style: 'row',
        grid: [
          { icon: 'fa-solid fa-award', heading: 'Director of the Year', text: 'IoD award for Corporate Social Responsibility.' },
          { icon: 'fa-solid fa-landmark', heading: 'Forbes Business Council', text: 'Admitted January 2025.' },
          { icon: 'fa-solid fa-certificate', heading: 'Fellow of the ISMM', text: 'Institute of Sales & Marketing Management.' },
          { icon: 'fa-solid fa-microphone', heading: 'TEDx speaker', text: 'Key-note speaker at events, conferences and schools.' },
        ],
      },
      {
        blockType: 'introContent',
        layout: 'split',
        eyebrow: '01 — The journey',
        heading: 'A burning desire to make a *positive impact.*',
        content: paragraphs(
          'Belfast-born Andrew Scott moved to England at 18 and embarked on a journey that would see him build, acquire and exit multiple companies, actively support good causes, inspire young people and mentor aspiring entrepreneurs.',
          'He has sat on the Chamber of Commerce committee and the Marketing Council of the GGF in London, and is a Fellow of the Institute of Sales & Marketing Management (ISMM).',
        ),
      },
      {
        blockType: 'repeaterContent',
        theme: 'dark',
        rows: [
          {
            eyebrow: '02 — Business champion',
            heading: 'Speaker, writer *& mentor.*',
            content: paragraphs(
              'Today Andrew oversees a group of autonomous, successful companies with global reach, specialising in the wider construction and home improvement sectors. He is a regular columnist and sought-after key-note speaker on marketing and business strategy — including a powerful TEDx Talk.',
              'As founder of Business Leader Magazine, launched in 2012 and sold in 2023, he has a network of over 100,000 CEOs, business owners and directors across the UK and beyond.',
            ),
            mediaType: 'image',
            images: [],
          },
        ],
      },
      {
        blockType: 'iconGrid',
        style: 'cards',
        grid: [
          {
            icon: 'fa-solid fa-hand-holding-heart',
            heading: 'Giving back',
            text: 'Andrew has helped raise hundreds of thousands of pounds for good causes. He is a Trustee/Director of homeless charity ‘Somewhere to Go’, and his employees can take part in a ‘giving back’ programme one day per month.',
            link: link('Our community work', '/community', { style: 'text' }),
          },
          {
            icon: 'fa-solid fa-briefcase',
            heading: 'Beyond the Group',
            text: 'Andrew is a board director of the exclusive Clifton Club in Bristol, a member of Bristol Private Equity Club, and holds a number of non-exec and advisory positions.',
            link: link('Visit AndrewScott.bio', 'http://www.andrewscott.bio', { style: 'text' }),
          },
        ],
      },
    ],
  },

  {
    title: 'Community',
    slug: 'community',
    meta: { description: 'Charity, CSR and environmental commitments at the Ascot Group.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'large',
        preHeading: 'Community',
        heading: 'CSR isn’t about *ticking boxes.*',
        text: 'Since 2004 we’ve been actively involved in making a direct contribution to our community, the environment and a sustainable future.',
        type: 'image',
        images: [m.people],
      },
      {
        blockType: 'introContent',
        layout: 'split',
        eyebrow: '01 — Impact',
        stat: {
          value: '£500k+',
          caption: 'raised for dozens of charities and good causes, directly and with our partners and clients.',
        },
        content: paragraphs(
          'Our dedicated ‘ACT’ (Ascot Community Team) meets every month to explore how we can best support good causes — whether that’s fundraising or taking part in activities.',
          'In 2017 CEO Andrew Scott received the IoD ‘Corporate Responsibility Award’ for our work in North Somerset and the wider community, and for developing and supporting our people through their careers and life journeys.',
        ),
      },
      {
        blockType: 'repeaterContent',
        theme: 'dark',
        firstImageSide: 'right',
        rows: [
          {
            eyebrow: '02 — Environment',
            heading: 'Work local, *commute less.*',
            content: paragraphs(
              'Our purpose-built Weston-super-Mare offices spare employees the stress and environmental impact of commuting into congested Bristol. With easy walking and cycling, and Worle train station right next door, the office is simple to reach for employees and visitors alike.',
            ),
            mediaType: 'image',
            images: [m.hq],
          },
        ],
      },
      {
        blockType: 'iconGrid',
        theme: 'dark',
        style: 'bordered',
        grid: [
          { icon: 'fa-solid fa-recycle', heading: 'Full recycling facilities' },
          { icon: 'fa-solid fa-lightbulb', heading: 'Low-energy LED lighting' },
          { icon: 'fa-solid fa-temperature-half', heading: 'Intelligent climate control' },
          { icon: 'fa-solid fa-charging-station', heading: '8 EV charging points' },
        ],
      },
      {
        blockType: 'iconGrid',
        style: 'pills',
        introEyebrow: '03 — Causes',
        introHeading: 'Some of the charities *we’ve supported*',
        grid: [
          "Alzheimer's Society",
          'Bobby Moore Fund',
          'Brandon Live Free',
          'Cancer Research UK',
          "Children's Hospice South West",
          'Children with Cancer UK',
          'Comic Relief',
          "Hope House Children's Hospices",
          'Jeans for Genes',
          'Lighthouse',
          'Macmillan Cancer Support',
        ].map((heading) => ({ heading })),
      },
    ],
  },

  {
    title: 'Careers',
    slug: 'careers',
    meta: { description: 'Current vacancies across marketing, data, technology and media at the Ascot Group.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'large',
        preHeading: 'Careers',
        heading: 'Building a future with *the Ascot Group.*',
        text: 'A dynamic, fast-paced business operating from modern offices in Worle, North Somerset, with a satellite office in London.',
        type: 'image',
        images: [m.people],
      },
      { blockType: 'testimonials', style: 'quote', testimonials: ['andrew'] },
      {
        blockType: 'repeaterContent',
        theme: 'dark',
        rows: [
          {
            eyebrow: '01 — Culture',
            heading: '#Work*Local*',
            content: paragraphs(
              'Nobody wants to commute into a congested city — but sitting at home all day can take its toll too. Our team is mainly home-grown talent: managers and directors who started at the bottom and worked up, creating a family-like culture built on integrity, humility, respect and fairness.',
            ),
            mediaType: 'image',
            images: [m.office],
          },
        ],
      },
      {
        blockType: 'iconGrid',
        theme: 'dark',
        style: 'bordered',
        grid: [
          { icon: 'fa-solid fa-couch', heading: 'Staff lounge' },
          { icon: 'fa-solid fa-square-parking', heading: 'On-site parking' },
          { icon: 'fa-solid fa-bicycle', heading: 'Cycle facilities' },
          { icon: 'fa-solid fa-charging-station', heading: 'EV charging points' },
          { icon: 'fa-solid fa-clock', heading: 'Mon–Fri, 8:30am–5pm, early finish Fridays' },
          { icon: 'fa-solid fa-champagne-glasses', heading: 'Regular social events' },
        ],
      },
      {
        blockType: 'jobsList',
        anchor: 'vacancies',
        introEyebrow: '02 — Opportunities',
        introHeading: 'Current *vacancies*',
        introText: 'Not all vacancies are listed. Can’t see your ideal role? Apply below.',
        emptyText: 'No roles match your search — send us your CV instead.',
        cta: {
          heading: 'Not applying for a specific role?',
          text: 'If you have the right skills — and more importantly the right attitude — tell us a little about yourself and send your CV.',
          button: link('Apply for other role', '/careers/apply'),
        },
      },
      {
        blockType: 'testimonials',
        theme: 'grey',
        style: 'grid',
        introHeading: 'Our people, *in their words*',
        testimonials: ['sam', 'jade'],
      },
    ],
  },

  {
    title: 'News',
    slug: 'news',
    meta: { description: 'The latest news from the Ascot Group.' },
    layout: [
      { blockType: 'banner', variant: 'default', preHeading: 'Newsroom', heading: 'Ascot Group *news.*' },
      { blockType: 'postsLoop', perPage: 13, showFilters: true },
    ],
  },

  {
    title: 'Acquisitions',
    slug: 'acquisitions',
    meta: { description: 'The Ascot Group is actively seeking acquisitions aligned to our strategy.' },
    layout: [
      {
        blockType: 'banner',
        variant: 'large',
        preHeading: 'Acquisitions',
        heading: 'Is it time to exit *your business?*',
        text: 'Perhaps it’s the right time to sell, you want to retire, your circumstances have changed — or your business is facing difficult challenges.',
        type: 'image',
        images: [],
      },
      {
        blockType: 'iconGrid',
        style: 'cards',
        numbered: true,
        introEyebrow: '01 — What we look for',
        introHeading: 'Actively seeking acquisitions aligned to *our strategy.*',
        introText:
          'With strong liquidity, an expert management team and an established network of financial, legal and HR advisors, we can move quickly — often without the constraints of external funding.',
        grid: [
          { heading: '£250k – £10m turnover', text: 'Larger acquisitions also considered.' },
          { heading: '3+ years trading', text: 'An established base of satisfied customers.' },
          { heading: 'Growth potential', text: 'Significant and tangible room to grow.' },
          { heading: 'Complementary sectors', text: 'Publishing & media, business data, marketing services, martech, lead generation, advertising and mobile tech.' },
          { heading: 'Any financial situation', text: 'Profitable or loss-making.' },
          { heading: '100% acquisitions', text: 'We only acquire 100% of the shares or assets.' },
        ],
      },
      {
        blockType: 'iconGrid',
        theme: 'dark',
        style: 'bordered',
        introHeading: 'A professional, *confidential process.*',
        grid: [
          {
            icon: 'fa-solid fa-user-tie',
            heading: 'Owner managed',
            text: 'We understand the emotion, energy and years of hard work that go into building a business, and your loyalty to staff, customers and suppliers. We’ll make the transition as smooth as possible.',
          },
          {
            icon: 'fa-solid fa-building',
            heading: 'Institutional / corporate',
            text: 'For groups restructuring or disposing of a business that no longer fits their objectives, we provide the time, resources and the ‘home’ it really needs.',
          },
          {
            icon: 'fa-solid fa-handshake',
            heading: 'Knightstone Capital',
            text: 'Outside marketing, media and tech? Our partner Knightstone Capital acquires or invests in SMEs from manufacturing and retail to hospitality and property.',
          },
        ],
      },
      {
        blockType: 'repeaterContent',
        rows: [
          {
            eyebrow: '02 — What we’ll need',
            heading: 'Start with a *Memorandum of Information.*',
            content: paragraphs(
              'It covers the business, its finances and operations, your reasons for exiting and your expectations from the deal. Every enquiry is handled in strict confidence, from NDA to due diligence and completion.',
            ),
            buttons: [
              button('Request a copy', '/contact'),
              button('business@ascotgroup.co.uk', 'mailto:business@ascotgroup.co.uk', { icon: 'fa-solid fa-envelope' }),
            ],
            mediaType: 'image',
            images: [],
          },
        ],
      },
    ],
  },

  {
    title: 'Contact',
    slug: 'contact',
    meta: { description: 'Call 01934 428 771 or send the Ascot Group a message.' },
    layout: [
      {
        blockType: 'formSection',
        eyebrow: 'Contact',
        heading: 'Let’s *talk.*',
        showContactDetails: true,
        formHeading: 'Send us a message',
        form: forms.contact,
      },
      { blockType: 'gallery', gallery: [m.hq] },
    ],
  },

  legalPage('Terms & privacy', 'terms-and-privacy', 'Terms *& privacy.*', [
    ['Use of this website', 'This site is for your personal use only. You may not distribute, exchange, modify, sell or transmit anything you copy from this site, including but not limited to any text, images, audio and video, for any business, commercial or public purposes.'],
    ['Intellectual property', ''],
    ['Privacy statement', ''],
    ['How we use your data', ''],
    ['Job applications & CVs', 'Information provided through job applications, including any CV, is stored for 12 months and may be used in the assessment of current or future roles.'],
    ['Your rights', ''],
    ['Contact us', 'The Ascot Group, Unit 200, Worle Park Way, Weston-super-Mare, BS22 6WA. Telephone 01934 428 771.'],
  ]),

  legalPage('Cookie policy', 'cookie-policy', 'Cookie *policy.*', [
    ['What is a cookie?', 'A cookie is a small file that is placed on your computer’s browser upon visiting the website. It helps our website’s functionality to display correctly.'],
    ['How we use cookies', ''],
    ['Essential cookies', ''],
    ['Analytics cookies', ''],
    ['Third-party cookies', ''],
    ['Managing your cookies', ''],
    ['Contact us', 'The Ascot Group, Unit 200, Worle Park Way, Weston-super-Mare, BS22 6WA. Telephone 01934 428 771.'],
  ]),
]

function legalPage(title: string, slug: string, heading: string, sections: [string, string][]) {
  return {
    title,
    slug,
    meta: {},
    layout: [
      {
        blockType: 'banner',
        variant: 'default',
        preHeading: 'Legal',
        heading,
        buttons: [button('Terms & privacy', '/terms-and-privacy'), button('Cookie policy', '/cookie-policy')],
      },
      {
        blockType: 'numberedSections',
        contentsHeading: 'Contents',
        sections: sections.map(([sectionHeading, body]) => ({
          heading: sectionHeading,
          content: body ? paragraphs(body) : undefined,
        })),
      },
    ],
  }
}
