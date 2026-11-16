import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import './Faq.css'

const { faq, email } = site

/**
 * "BEFORE YOU ASK…".
 *
 * The answers are visible by default — this is deliberately not an accordion.
 * Measured at the 1512 frame: the red heading starts at x 110.2 / y 2441.7 on
 * a 65.5 line pitch, the CTA sits at y 2645.5, and the items run down the
 * right column from x 436.8 with a 183 pitch.
 */
export function Faq() {
  const mailto = email ? `mailto:${email}` : null

  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq__grid">
        <div className="faq__aside">
          <h2 id="faq-title" className="faq__heading">
            {/* The visual lines carry no spaces, so give the heading its own
                readable text and hide the display version from the a11y tree. */}
            <span className="u-sr-only">Before you ask…</span>
            <span aria-hidden="true">
              {faq.heading.map((line) => (
                <span className="faq__heading-line" key={line}>{line}</span>
              ))}
            </span>
          </h2>
          {mailto ? (
            <a className="u-btn faq__cta" href={mailto}>{faq.cta}</a>
          ) : (
            <span className="u-btn u-btn--off faq__cta" aria-disabled="true">{faq.cta}</span>
          )}
        </div>

        <ol className="faq__list">
          {faq.items.map((item) => (
            <Reveal as="li" className="faq__item" key={item.n}>
              <span className="faq__n" aria-hidden="true">{item.n}</span>
              <h3 className="faq__q">{item.q}</h3>
              <p className="faq__a">{item.a}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
