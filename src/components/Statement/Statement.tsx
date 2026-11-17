'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { site } from '../../data/site'
import './Statement.css'

const WORDS = site.statement.text.split(' ')

/**
 * The statement that lands before Selected Work.
 *
 * Measured from the reference's own section: each word carries an index and
 * a fill factor, and the fill is driven by scroll position every frame
 * rather than by a timed stagger — the words are dim at 0.14 and light to
 * full as the section climbs the viewport. Sampled on the reference, with
 * the section top at 510px of a 950px viewport every word read 0, at 330px
 * they read 1, 1, 0.726, 0, 0, 0, 0, and by 0 all of them were full. That
 * sweep is what this reproduces: the fill crosses roughly one word at a
 * time with a word of overlap, over the section's last ~0.55 of a screen.
 *
 * `--f` defaults to 1 in the stylesheet, so the complete statement is
 * visible with no JavaScript and under reduced motion, where this never
 * attaches a listener at all. The fill is written straight to the nodes
 * from one rAF-throttled handler, so scrolling never triggers a React
 * render, and only opacity changes — nothing moves, so nothing can shift
 * the layout.
 */
export function Statement() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = [...section.querySelectorAll<HTMLElement>('.statement__w')]
    if (!words.length) return

    let frame = 0

    const paint = () => {
      frame = 0
      const top = section.getBoundingClientRect().top
      // the window the reference fills over: the last ~0.55 of a screen
      const span = window.innerHeight * 0.55
      const progress = Math.min(Math.max(1 - top / span, 0), 1)
      // + 1 so the sweep still has somewhere to travel on the last word
      const reach = progress * (words.length + 1)
      for (let i = 0; i < words.length; i++) {
        const f = Math.min(Math.max(reach - i, 0), 1)
        words[i].style.setProperty('--f', f.toFixed(3))
      }
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      // leave it readable if this ever tears down mid-sweep
      words.forEach((w) => w.style.removeProperty('--f'))
    }
  }, [])

  return (
    <section className="statement" ref={ref} aria-labelledby="statement-title">
      <h2 id="statement-title" className="statement__text">
        {/* the sentence read once, not word by word */}
        <span className="u-sr-only">{site.statement.text}</span>
        <span aria-hidden="true">
          {WORDS.map((w, i) => (
            <span
              className="statement__w"
              key={`${w}-${i}`}
              style={{ '--wi': i } as CSSProperties}
            >
              {w}{' '}
            </span>
          ))}
        </span>
      </h2>
    </section>
  )
}
