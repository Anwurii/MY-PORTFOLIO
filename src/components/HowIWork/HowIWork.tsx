import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import './HowIWork.css'

const { process: proc } = site

/**
 * How I Work — "A CLEAR PATH FROM IDEA TO LAUNCH."
 *
 * Heading upper left, the opening paragraph upper right, then an open band
 * before four stages laid out two by two: 01 · 02, then 03 · 04. Thin rules
 * close each stage row and a pair of close-set vertical guides runs between
 * the columns. The oversized numbers sit beside their text and drop onto the
 * rule below them.
 *
 * Typography is the supplied desktop spec, written against the 1512 frame so
 * it is exact there and scales with the rest of the page below it. The values
 * are gathered at the top of HowIWork.css.
 *
 * A server component: both entrances are CSS, driven only by the `is-in`
 * class that Reveal toggles.
 */
export function HowIWork() {
  const [headA, headB] = proc.heading

  return (
    <section className="hiw" id="process" aria-labelledby="hiw-title">
      <div className="hiw__inner">
        <div className="hiw__top">
          <h2 id="hiw-title" className="hiw__heading">
            {/* Each line rises out of its own clip box; the boxes never move. */}
            <span className="u-sr-only">{`${headA} ${headB}`}</span>
            <span aria-hidden="true">
              <Rise as="span" className="hiw__heading-line" delay={0}>
                {headA}
              </Rise>
              <Rise as="span" className="hiw__heading-line" delay={90}>
                {headB}
              </Rise>
            </span>
          </h2>

          <Rise as="p" className="hiw__intro" delay={180}>
            {proc.intro}
          </Rise>
        </div>

        <ol className="hiw__stages">
          {proc.stages.map((s, i) => (
            <Reveal
              as="li"
              effect="none"
              key={s.n}
              /* staggered against the other stage on its row, not against
                 stages the visitor has not reached yet */
              delay={(i % 2) * 100}
              className="hiw__stage"
            >
              {/* The rule belongs to the <li> and the entrance to the group
                  inside it, so the dividers never move. */}
              <div className="hiw__stage-group">
                <span className="hiw__n" aria-hidden="true">
                  {s.n}
                </span>
                <div className="hiw__stage-text">
                  <h3 className="hiw__stage-title">{s.title}</h3>
                  <p className="hiw__stage-body">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * One line that travels up from behind the edge of its own clip box.
 *
 * The box carries extra room below the baseline and pulls it back with a
 * matching negative margin, so the clip edge sits clear of the descenders
 * once the line has settled and the layout is unchanged.
 */
function Rise({
  children,
  className,
  delay,
  as,
}: {
  children: string
  className: string
  delay: number
  as: 'span' | 'p'
}) {
  return (
    <Reveal as={as} effect="none" className={`hiw__rise ${className}`} delay={delay}>
      <span className="hiw__rise-ink">{children}</span>
    </Reveal>
  )
}
