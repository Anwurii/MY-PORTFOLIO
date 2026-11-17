import type { CSSProperties } from 'react'
import Image from 'next/image'
import { site } from '../../data/site'
import { PerspectiveGrid } from '../PerspectiveGrid/PerspectiveGrid'
import { ToolStack } from './ToolStack'
import './Hero.css'

const { hero, images, email } = site

/**
 * Hero composition.
 *
 * Laid out on an explicit 1512 × 960 canvas — the design frame measured from
 * design-reference/hero-reference.png. Every block carries its measured
 * position as `--x` / `--y` (CSS px at that frame) and the whole canvas is
 * multiplied by `--u`, which is 1px at 1512 and scales down below it.
 * Below 760px the canvas is dropped for a stacked flow layout.
 *
 * The six words are three lines of 130px type on a 208px baseline pitch, in
 * two columns. The hairlines sit at the x-height and the baseline of each
 * line, and pass behind the portrait.
 *
 * Entrance is pure CSS, plays once on load, and is disabled wholesale under
 * prefers-reduced-motion — see the animation block in Hero.css.
 */

/**
 * Measured position on the 1512-wide design frame, plus the entrance delay,
 * as CSS custom properties.
 */
const at = (x?: number, y?: number, delay?: number): CSSProperties =>
  ({
    ...(x !== undefined && { '--x': x }),
    ...(y !== undefined && { '--y': y }),
    ...(delay !== undefined && { '--d': `${delay}ms` }),
  }) as CSSProperties

/** y of each hairline, measured from the reference (CSS px @1512) */
const RULES = [167.1, 230.6, 374.2, 438.5, 579.1, 647.1]

export function Hero() {
  const mailto = email ? `mailto:${email}` : null

  return (
    <section className="hero" id="intro" aria-labelledby="hero-title">
      <h1 id="hero-title" className="u-sr-only">
        I’m Anwurii, and I make ideas work.
      </h1>

      <div className="hero__canvas">
        {RULES.map((y) => (
          <span key={y} className="hero__rule" style={at(undefined, y)} aria-hidden="true" />
        ))}

        <PerspectiveGrid variant="floor" vanishY={-0.28} className="hero__floor pgrid--band-bottom" />

        {/* ---------- left column: eyebrow + three words ---------- */}
        <div className="hero__block hero__eyebrow hero__in--left" style={at(14.3, 160.6, 120)}>
          <p>{hero.eyebrow}</p>
        </div>

        <div className="hero__words hero__words--left" aria-hidden="true">
          <span className="hero__word" style={at(276.8, undefined, 0)}>
            <span className="hero__ink">{hero.lines[0].left}</span>
          </span>
          <span className="hero__word" style={at(60.3, undefined, 100)}>
            <span className="hero__ink">and<i className="hero__gap" />i</span>
          </span>
          <span className="hero__word" style={at(124.1, undefined, 200)}>
            <span className="hero__ink">{hero.lines[2].left}</span>
          </span>
        </div>

        {/* ---------- right column: three words ---------- */}
        <div className="hero__words hero__words--right" aria-hidden="true">
          <span className="hero__word" style={at(973.6, undefined, 0)}>
            <span className="hero__ink">{hero.lines[0].right}</span>
          </span>
          <span className="hero__word" style={at(1068.2, undefined, 100)}>
            <span className="hero__ink">{hero.lines[1].right}</span>
          </span>
          <span className="hero__word" style={at(1081.1, undefined, 200)}>
            <span className="hero__ink">{hero.lines[2].right}</span>
          </span>
        </div>

        <div className="hero__block hero__note hero__in--right" style={at(1220.4, 259.6, 220)}>
          <p>{hero.experience}</p>
        </div>

        {/* ---------- portrait ---------- */}
        <div className="hero__portrait hero__in--fade" style={at(471, 224.5, 180)}>
          <div className="hero__portrait-inner">
            <Image
              className="hero__portrait-img"
              src={images.portrait}
              alt={hero.portraitAlt}
              width={1024}
              height={1536}
              sizes="(max-width: 759px) 110vw, 40vw"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* ---------- supporting copy ---------- */}
        <div
          className="hero__block hero__copy hero__copy--left hero__in--left"
          style={at(23.1, 704.7, 320)}
        >
          <p>{hero.leftCopy}</p>
        </div>

        <div className="hero__block hero__tools hero__in--left" style={at(23.1, 836, 400)}>
          <p>
            <span>{hero.toolsLabel}</span>
            <ToolStack />
          </p>
        </div>

        <div
          className="hero__block hero__copy hero__copy--right hero__in--right"
          style={at(1049, 704.7, 320)}
        >
          <p>{hero.rightCopy}</p>
        </div>

        <div className="hero__block hero__cta hero__in--right" style={at(1049.3, 845.2, 400)}>
          {mailto ? (
            <a className="u-btn" href={mailto}>{hero.cta}</a>
          ) : (
            <span className="u-btn u-btn--off" aria-disabled="true">{hero.cta}</span>
          )}
        </div>
      </div>
    </section>
  )
}
