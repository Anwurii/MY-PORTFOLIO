import { site } from '../../data/site'
import './Ticker.css'

/**
 * Endless skills carousel.
 *
 * Two identical runs sit side by side and the track is translated by exactly
 * -50%, so the moment the animation restarts the second run is pixel-for-pixel
 * where the first one began — no jump. It never pauses: no controls, no hover
 * or click handling, which also means this needs no client JavaScript.
 *
 * The moving strip is hidden from assistive technology and the four skills are
 * exposed once as a plain list, so the duplicated copies are never announced.
 */
export function Ticker() {
  const run = (
    <span className="ticker__run">
      {site.ticker.map((label) => (
        <span className="ticker__item" key={label}>
          <span className="ticker__sep" />
          <span className="ticker__label">{label}</span>
        </span>
      ))}
    </span>
  )

  return (
    <section className="ticker" aria-labelledby="ticker-title">
      <h2 id="ticker-title" className="u-sr-only">What I work on</h2>
      <ul className="u-sr-only">
        {site.ticker.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      <div className="ticker__viewport" aria-hidden="true">
        <div className="ticker__track">
          {run}
          {run}
        </div>
      </div>
    </section>
  )
}
