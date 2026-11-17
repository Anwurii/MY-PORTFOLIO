import Link from 'next/link'
import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
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
        <Reveal as="div" className="exp__intro">
          <p className="exp__stat">{experience.stat}</p>
          <p className="exp__stat-sub">{experience.statSub}</p>
        </Reveal>

        <ol className="exp__list">
          {experience.entries.map((e, i) => (
            <Reveal as="li" className="exp__item" key={e.id} delay={Math.min(i, 3) * 70}>
              <div className="exp__head">
                <h3 className="exp__company">
                  <Company entry={e} />
                </h3>
                <p className="exp__years">{e.years}</p>
              </div>
              <p className="exp__summary">{e.summary}</p>
            </Reveal>
          ))}
        </ol>
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
  const label = entry.employment ? (
    <>
      {entry.company}
      <span className="exp__employment"> · {entry.employment}</span>
    </>
  ) : (
    entry.company
  )

  if (!entry.caseStudySlug) return <>{label}</>
  return (
    <Link className="exp__link" href={`/work/${entry.caseStudySlug}`}>
      {label}
    </Link>
  )
}
