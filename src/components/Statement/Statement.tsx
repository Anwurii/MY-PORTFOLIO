'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { site } from '../../data/site'
import './Statement.css'

const { statement } = site
const ROTATING = statement.rotating
/** The hold; the 500ms swap itself is the transition in Statement.css. */
const HOLD_MS = 1800

/** The sentence as it reads when it is standing still. */
const FULL_TEXT = `${statement.lines.join(' ')} ${ROTATING[0]}`

/**
 * The statement between Selected Work and Selected experience.
 *
 * Three centred lines over a dotted ground, the last one cycling, with four
 * cursor labels tucked against the type.
 *
 * Two things are measured rather than guessed, both after the fonts have
 * actually loaded and again whenever the viewport changes:
 *
 *  - the headline size, solved so the longest line fills ~75% of the
 *    section, which is what makes it dominate the way the reference does;
 *  - the rotating frame's width, taken from the widest alternate at the
 *    real rendered size, so no word is ever clipped and the line never
 *    changes width mid-rotation.
 *
 * Each label nests three wrappers — entrance, float, lean — so the three
 * transforms compose instead of overwriting one another.
 */
export function Statement() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const [index, setIndex] = useState(0)

  /* ---- sizing: headline and rotating frame ------------------------- */
  useEffect(() => {
    const section = sectionRef.current
    const head = headRef.current
    if (!section || !head) return

    /*
     * The headline size is a fixed value in the stylesheet now, so the only
     * thing left to solve is the rotating frame — and it is solved from the
     * size and tracking the headline actually ended up with, read back off
     * the element rather than assumed, so it stays right at every
     * breakpoint and after the real face resolves.
     */
    const measure = () => {
      const styles = getComputedStyle(head)
      const size = parseFloat(styles.fontSize)
      const tracking = parseFloat(styles.letterSpacing) || 0
      if (!size) return

      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return
      ctx.font = `${styles.fontWeight} ${size}px ${styles.fontFamily}`
      ctx.letterSpacing = `${tracking}px`

      const inkWidth = (text: string) => {
        const m = ctx.measureText(text)
        return m.actualBoundingBoxLeft + m.actualBoundingBoxRight
      }

      /*
       * The widest alternate sets the frame. Canvas metrics and the DOM's
       * own layout disagree by a pixel or two, so round up and add a hair
       * of slack rather than leave the widest word fractionally over.
       */
      const widest = ROTATING.reduce((a, b) => (inkWidth(b) > inkWidth(a) ? b : a))
      section.style.setProperty('--rot-width', `${Math.ceil(inkWidth(widest)) + 3}px`)
    }

    measure()
    window.addEventListener('resize', measure, { passive: true })
    // metrics change the moment the real face resolves
    document.fonts?.ready?.then(measure).catch(() => {})

    return () => window.removeEventListener('resize', measure)
  }, [])

  /* ---- the rotating word ------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer = 0
    const start = () => {
      if (timer) return
      timer = window.setInterval(() => setIndex((i) => (i + 1) % ROTATING.length), HOLD_MS)
    }
    const stop = () => {
      window.clearInterval(timer)
      timer = 0
    }

    /*
     * Start first; the observer only ever pauses. Gating the start on it is
     * fail-closed — anywhere its callbacks are delayed the word would never
     * rotate at all.
     */
    start()
    section.classList.add('is-ready')

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          section.classList.toggle('is-paused', !entry.isIntersecting)
          if (entry.isIntersecting) start()
          else stop()
        },
        { rootMargin: '10% 0px' },
      )
      io.observe(section)
    }

    return () => {
      io?.disconnect()
      stop()
    }
  }, [])

  /* ---- a quick, restrained lean toward the pointer ----------------- */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const leans = [...section.querySelectorAll<HTMLElement>('.statement__lean')]
    if (!leans.length) return

    let frame = 0
    let nx = 0
    let ny = 0

    const paint = () => {
      frame = 0
      for (const lean of leans) {
        const mx = Number(lean.dataset.mx ?? 0)
        const my = Number(lean.dataset.my ?? 0)
        // straight to the node: pointer movement never re-renders
        lean.style.transform = `translate3d(${(nx * mx).toFixed(2)}px, ${(ny * my).toFixed(2)}px, 0)`
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    const onLeave = () => {
      nx = 0
      ny = 0
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const previous = (index - 1 + ROTATING.length) % ROTATING.length

  return (
    <section className="statement" ref={sectionRef} aria-labelledby="statement-title">
      <div className="statement__stage">
        <h2 id="statement-title" className="statement__text" ref={headRef}>
          {/* read once, standing still */}
          <span className="u-sr-only">{FULL_TEXT}</span>

          <span aria-hidden="true">
            {statement.lines.map((line) => (
              <span className="statement__line" key={line}>
                {line}
              </span>
            ))}

            <span className="statement__line">
              <span className="statement__rot">
                {ROTATING.map((w, i) => (
                  <span
                    key={w}
                    className={`statement__word${
                      i === index ? ' is-on' : i === previous ? ' is-out' : ''
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </span>
        </h2>

        {/* anchored to the headline box, not the section edges */}
        <div className="statement__labels" aria-hidden="true">
          {statement.labels.map((l, i) => (
            <span
              key={l.text}
              className={`statement__label is-${l.tone} is-sharp-${l.corner} is-arrow-${l.arrow}`}
              style={{ '--x': `${l.x}%`, '--y': `${l.y}%`, '--i': i } as CSSProperties}
            >
              <span className="statement__enter">
                <span className="statement__float">
                  <span className="statement__lean" data-mx={l.mx} data-my={l.my}>
                    <span className="statement__pill">{l.text}</span>
                    <Arrow />
                  </span>
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * A pointer cursor — the arrow-with-tail silhouette, filled in the label's
 * colour with a white outline. Drawn here rather than taken from anywhere.
 */
function Arrow() {
  return (
    <svg className="statement__arrow" viewBox="0 0 20 22" focusable="false" aria-hidden="true">
      <path
        d="M2.6 1.5 17.2 11.4 10.3 11.9 13.6 18.6 10.6 20 7.3 13.3 2.6 17.6 Z"
        fill="currentColor"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
