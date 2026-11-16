import { site } from '../data/site'

/**
 * The production origin.
 *
 * No domain has been supplied, so this reads from NEXT_PUBLIC_SITE_URL and
 * falls back to localhost. Canonical URLs, the sitemap, robots and social
 * images all derive from it, so set it in Vercel (and in .env.local) before
 * launch — see ASSET-CHECKLIST.md. Nothing here invents a domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

export const hasRealDomain = Boolean(process.env.NEXT_PUBLIC_SITE_URL)

/**
 * schema.org graph describing who this page is about.
 *
 * This is the part search engines and AI assistants read to understand that
 * the page is a named person's portfolio rather than an unlabelled page of
 * text. `sameAs` is deliberately omitted until verified profile URLs exist —
 * a wrong one would link the wrong identity.
 */
export function buildJsonLd() {
  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: site.name,
    jobTitle: site.role,
    description: site.meta.description,
    url: SITE_URL,
    image: `${SITE_URL}${site.images.portrait}`,
    ...(site.email ? { email: `mailto:${site.email}` } : {}),
    knowsAbout: [...site.ticker],
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${site.name} — ${site.role}`,
    description: site.meta.description,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#person` },
  }

  const profile = {
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: site.meta.title,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: { '@id': `${SITE_URL}/#person` },
  }

  // The FAQ is visible on the page, so it is eligible for FAQ structured data.
  const faq = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: site.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const work = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#selected-work`,
    name: site.work.heading,
    itemListElement: site.work.projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/work/${p.slug}#project`,
        name: p.title,
        url: `${SITE_URL}/work/${p.slug}`,
        creator: { '@id': `${SITE_URL}/#person` },
        keywords: [...p.tags],
        sameAs: p.behanceUrl,
        ...(p.placeholder ? {} : { image: `${SITE_URL}${p.image}` }),
      },
    })),
  }

  return { '@context': 'https://schema.org', '@graph': [person, website, profile, faq, work] }
}
