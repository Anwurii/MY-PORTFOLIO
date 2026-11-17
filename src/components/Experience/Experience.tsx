import type { CSSProperties } from 'react'
import Link from 'next/link'
import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import { ResumeModal } from './ResumeModal'
import './Experience.css'

const { experience } = site

/**
 * Selected experience.
 *
 * Two columns, following the layout reference: the years-of-practice figure
 * on the left, the history as a plain vertical list on the right. Each entry
 * puts the company on the left and the year on the same baseline at the
 * right edge, with one sentence underneath — no table, no rules between
 * columns, no hover previews.
 *
 * Only entries with a working internal case study become links; the rest are
 * plain text rather than destinations that would go nowhere.
 *
 * A server component: the only moving part is the shared scroll reveal,
 * which already renders its final state under reduced motion.
 */
export function Experience() {
  return (
    <section className="exp" id="experience" aria-labelledby="exp-title">
      <h2 id="exp-title" className="u-sr-only">
        {experience.label}
      </h2>

      <div className="exp__grid">
        <Reveal as="p" effect="none" className="exp__headline">
          {experience.headline}
        </Reveal>

        <div className="exp__right">
          {/*
            One observer on the list, not one per entry: the reference
            triggers the whole batch together and staggers the children off
            an --i index, which is what gives the cascade its even rhythm
            however fast the visitor scrolls.
          */}
          <Reveal as="ol" effect="none" className="exp__list">
            {experience.entries.map((e, i) => (
              <li className="exp__item" key={e.id} style={{ '--i': i } as CSSProperties}>
                <div className="exp__head">
                  <h3 className="exp__company">
                    <Company entry={e} />
                  </h3>
                  <p className="exp__years">{e.years}</p>
                </div>
                <p className="exp__summary">{e.summary}</p>
              </li>
            ))}
          </Reveal>

          <ResumeModal />
        </div>
      </div>
    </section>
  )
}

/**
 * The company name, and its employment type where one is known.
 *
 * `employment` is null for every entry today — see the note in site.ts — so
 * this renders the name alone rather than a separator with nothing after it.
 * Filling the field in is all that is needed to turn it on.
 */
function Company({ entry }: { entry: (typeof experience.entries)[number] }) {
  /*
   * Only the company name is the link. The employment type sits outside it,
   * so the case study's accessible name stays "Senta Finance" rather than
   * "Senta Finance · Full-time", and the hover underline tracks the name.
   */
  const name = entry.caseStudySlug ? (
    <Link className="exp__link" href={`/work/${entry.caseStudySlug}`}>
      {entry.company}
    </Link>
  ) : (
    entry.company
  )

  return (
    <>
      {name}
      {entry.employment ? (
        <span className="exp__employment"> · {entry.employment}</span>
      ) : null}
    </>
  )
}
