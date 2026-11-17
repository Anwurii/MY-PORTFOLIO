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
 * The statement before Selected Work.
 *
 * Three centred lines over a dotted near-black ground, with the last line
 * cycling, and five drifting labels arranged around the type.
 *
 * Measured from the reference section rather than guessed: ground
 * #111113 under a 21.6px dot grid, labels as pills with one square corner
 * — 18px at weight 500, 14/22 padding, 40px radii — each drifting on its
 * own `drift 6s + 1.3s × index, infinite alternate ease-in-out` of no more
 * than six pixels. The colours are the reference's palette; the wording,
 * the arrow and the typeface are the owner's.
 *
 * Nothing here can shift the layout: the rotating word sits in a frame
 * sized by a hidden copy of the longest alternate, so the line never
 * changes width, and only transforms move.
 *
 * Screen readers get one static sentence; the moving copy is hidden from
 * them, so the rotation is never announced. Under reduced motion the first
 * word stays put and the labels do not drift.
 */
export function Statement() {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)

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
     * Start first, and let the observer only ever pause it. Gating the
     * start on the observer is fail-closed: anywhere its callbacks are
     * delayed or never delivered — a throttled tab, an environment without
     * it — the word would simply never rotate. This way the worst case is
     * that it rotates offscreen for a while.
     */
    start()

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

  /* ---- a restrained lean toward the pointer ------------------------ */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const labels = [...section.querySelectorAll<HTMLElement>('.statement__label')]
    if (!labels.length) return

    let frame = 0
    let nx = 0
    let ny = 0

    const paint = () => {
      frame = 0
      for (const label of labels) {
        const mx = Number(label.dataset.mx ?? 0)
        const my = Number(label.dataset.my ?? 0)
        // written straight to the node: pointer movement never re-renders
        label.style.setProperty('--px', `${(nx * mx).toFixed(2)}px`)
        label.style.setProperty('--py', `${(ny * my).toFixed(2)}px`)
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
  /* the longest alternate reserves the width, so the line never reflows */
  const widest = ROTATING.reduce((a, b) => (b.length > a.length ? b : a))

  return (
    <section className="statement" ref={sectionRef} aria-labelledby="statement-title">
      <h2 id="statement-title" className="statement__text">
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
              <span className="statement__sizer">{widest}</span>
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

      <div className="statement__labels" aria-hidden="true">
        {statement.labels.map((l) => (
          <span
            key={l.text}
            className={`statement__label is-${l.tone} is-sharp-${l.corner}`}
            data-mx={l.mx}
            data-my={l.my}
            style={{ '--x': l.x, '--y': l.y } as CSSProperties}
          >
            <span className="statement__pill">
              {l.text}
              <Arrow />
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

/** A plain pointer arrow, drawn here rather than taken from the reference. */
function Arrow() {
  return (
    <svg className="statement__arrow" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path
        d="M4.5 2.4 19.2 11.6 12.4 12.9 9.2 19.3 Z"
        fill="currentColor"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
