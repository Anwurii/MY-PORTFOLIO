import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { site } from '../../../data/site'
import { SITE_URL } from '../../../lib/seo'
import './case-study.css'

type Params = { slug: string }

export function generateStaticParams() {
  return site.work.projects.map((p) => ({ slug: p.slug }))
}

function find(slug: string) {
  return site.work.projects.find((p) => p.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = find(slug)
  if (!project) return {}

  const title = `${project.title} — ${site.role} case study`
  const description = `${project.behanceTitle}. ${project.tags.join(', ')}. Designed by ${site.name}.`

  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      url: `/work/${project.slug}`,
      title,
      description,
      ...(project.placeholder ? {} : { images: [{ url: project.image }] }),
    },
  }
}

/**
 * Case study page.
 *
 * Contains only what could be verified on the project's own Behance page:
 * the published title, its tags, and the cover artwork already supplied.
 * Those projects carry no written description, so there is deliberately no
 * problem/process/outcome narrative here — writing one would mean inventing
 * it. See ASSET-CHECKLIST.md.
 */
export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = find(slug)
  if (!project) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/work/${project.slug}#project`,
    name: project.title,
    alternateName: project.behanceTitle,
    url: `${SITE_URL}/work/${project.slug}`,
    creator: { '@id': `${SITE_URL}/#person` },
    keywords: [...project.tags],
    sameAs: project.behanceUrl,
  }

  return (
    <main className="cs" id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="cs__inner">
        <Link className="cs__back" href="/#work">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Selected Work
        </Link>

        <header className="cs__head">
          <h1 className="cs__title">{project.title}</h1>
          <p className="cs__subtitle">{project.behanceTitle}</p>
        </header>

        <ul className="cs__tags">
          {project.tags.map((t) => (
            <li className="cs__tag" key={t}>{t}</li>
          ))}
        </ul>

        <figure className={`cs__cover${project.placeholder ? ' is-placeholder' : ''}`}>
          <Image
            src={project.image}
            alt={project.alt}
            width={1400}
            height={1105}
            sizes="(max-width: 759px) 92vw, 1100px"
            priority
          />
          {project.placeholder && (
            <figcaption className="cs__note">
              Artwork for this project has not been supplied yet.
            </figcaption>
          )}
        </figure>

        <section className="cs__outbound" aria-labelledby="cs-full">
          <h2 className="cs__h2" id="cs-full">The full project</h2>
          <p className="cs__body">
            The complete project — every screen and the branding work around it —
            is published on Behance.
          </p>
          <a
            className="u-btn cs__cta"
            href={project.behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW ON BEHANCE
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="u-sr-only"> (opens in a new tab)</span>
          </a>
        </section>

        <nav className="cs__more" aria-label="Other projects">
          <h2 className="cs__h2">More work</h2>
          <ul>
            {site.work.projects
              .filter((p) => p.slug !== project.slug)
              .map((p) => (
                <li key={p.id}>
                  <Link className="cs__more-link" href={`/work/${p.slug}`}>
                    {p.title}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}
