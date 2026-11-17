import Image from 'next/image'
import Link from 'next/link'
import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import './SelectedWork.css'

const { work } = site

/**
 * Selected Work.
 *
 * A narrow introduction on the left that stays put while the four previews
 * scroll past it on the right, then releases at the end of the section. The
 * left column is a full-height grid track holding a `position: sticky` block,
 * so the stop is the section boundary itself — no scroll listener, nothing to
 * hijack.
 *
 * Each preview is one real link to its internal case study. On a fine
 * pointer the "View case study" label is carried by the site's own cursor
 * (see Cursor.tsx) rather than a second floating element; on touch, on
 * keyboard focus, and wherever that cursor is switched off, the label in the
 * corner of the preview takes over.
 *
 * Previews share one 1.4:1 container. The artworks run from 1.27:1 to 1.50:1,
 * so each one carries its own `objectPosition` in site.ts and nothing is
 * stretched.
 */
export function SelectedWork() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="work__grid">
        <div className="work__aside">
          <div className="work__sticky">
            <h2 id="work-title" className="work__title">
              {work.heading}
            </h2>
            <p className="work__intro">{work.intro}</p>
          </div>
        </div>

        <ol className="work__list">
          {work.projects.map((p, i) => (
            <Reveal as="li" className="work__item" key={p.id}>
              <Link
                className={`work__link${p.placeholder ? ' is-placeholder' : ''}`}
                href={`/work/${p.slug}`}
                aria-label={`${p.title} — ${work.cta}`}
                /* read by the custom cursor, which becomes the hover label */
                data-cursor-label={work.cta}
              >
                <span className="work__media">
                  <Image
                    className="work__img"
                    src={p.image}
                    alt={p.alt}
                    fill
                    /* the first tile is the page's LCP once the statement
                       sits below this section — Next warns about it
                       otherwise */
                    priority={i === 0}
                    style={{ objectPosition: p.objectPosition }}
                    sizes="(max-width: 759px) 92vw, (max-width: 1023px) 94vw, 808px"
                  />
                </span>
                <span className="work__cta" aria-hidden="true">
                  {work.cta}
                </span>
              </Link>

              <div className="work__caption">
                <h3 className="work__name">
                  {p.title}
                  {p.placeholder ? (
                    <span className="u-sr-only"> — artwork not supplied yet</span>
                  ) : null}
                </h3>
                <p className="work__desc">{p.caption}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
