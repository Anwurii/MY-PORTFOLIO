import Image from 'next/image'
import Link from 'next/link'
import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import './SelectedWork.css'

const { work } = site

/**
 * Selected Work.
 *
 * Two columns of artwork with the section heading between the rows, as the
 * reference has it. Measured at the 1512 frame: tiles 534.5 × 420.5,
 * container 104 → 1408, column gap 235.
 *
 * Each tile is one link to its internal case study. The project name sits
 * over the artwork and fades up on hover or keyboard focus; on touch (where
 * there is no hover) it stays visible, so nothing is hidden behind an
 * interaction a finger cannot perform.
 */
export function SelectedWork() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="work__grid">
        {work.projects.map((p, i) => (
          <Reveal
            as="figure"
            delay={(i % 2) * 90}
            className={`work__tile work__tile--${i + 1}${p.placeholder ? ' is-placeholder' : ''}`}
            key={p.id}
          >
            <Link className="work__link" href={`/work/${p.slug}`}>
              <Image
                className="work__img"
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 759px) 92vw, (max-width: 1023px) 46vw, 535px"
              />
              <span className="work__veil" aria-hidden="true" />
              <figcaption className="work__name">
                {p.title}
                {p.placeholder ? (
                  <span className="u-sr-only"> — artwork not supplied yet</span>
                ) : null}
              </figcaption>
            </Link>
          </Reveal>
        ))}

        {/* Revealed from the centre outward; the final position never moves. */}
        <h2 id="work-title" className="work__title">
          <RevealHeading>{work.heading}</RevealHeading>
        </h2>
      </div>
    </section>
  )
}

function RevealHeading({ children }: { children: string }) {
  return (
    <Reveal as="span" effect="none" className="work__title-inner">
      {children}
    </Reveal>
  )
}
