import { site } from '../../data/site'
import { PerspectiveGrid } from '../PerspectiveGrid/PerspectiveGrid'
import { Reveal } from '../Reveal/Reveal'
import './Quote.css'

/**
 * Quote band. Measured at the 1512 frame: the line sits at y 2181.7 with a
 * 47.8 cap height (≈67px), the attribution at 2271.1, both centred, over a
 * perspective grid that fades at both edges.
 */
export function Quote() {
  return (
    <section className="quote" aria-label="Quote">
      <PerspectiveGrid variant="band" className="quote__grid" />
      <Reveal as="figure" className="quote__inner">
        <blockquote className="quote__text">{site.quote.text}</blockquote>
        <figcaption className="quote__by">{site.quote.attribution}</figcaption>
      </Reveal>
    </section>
  )
}
