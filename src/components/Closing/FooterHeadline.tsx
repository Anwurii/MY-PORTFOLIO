'use client'

import { Fragment, useEffect, useRef } from 'react'

/**
 * "BETTER PRODUCTS BUILT / WITH ANWURII".
 *
 * Each character starts in the reference grey and turns white left to right
 * as the headline travels up through the viewport; moving the pointer over it
 * finishes the reveal. Progress is written to one custom property per
 * character, so only `color` changes — no layout is touched.
 *
 * The real heading text is exposed once for assistive technology; the split
 * characters are decorative and hidden, so it is never read letter by letter.
 */
export function FooterHeadline({ lines }: { lines: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const chars = Array.from(root.querySelectorAll<HTMLElement>('.closing__char'))
    if (!chars.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      chars.forEach((c) => c.style.setProperty('--lit', '1'))
      return
    }

    let frame = 0
    let hovered = false

    const paint = (progress: number) => {
      const n = chars.length
      chars.forEach((c, i) => {
        // each character lights over its own slice of the progress
        const start = i / n
        const lit = Math.min(1, Math.max(0, (progress - start) * n * 0.9 + 0.15))
        c.style.setProperty('--lit', lit.toFixed(3))
      })
    }

    const measure = () => {
      frame = 0
      if (hovered) return

      /*
       * The headline sits near the end of the document, so it never travels a
       * full viewport height — at maximum scroll its top is still well down
       * the screen. Normalising against the full viewport would leave the
       * last characters permanently grey, so the reveal completes once the
       * headline's top reaches the upper 55% of the viewport, which it does
       * reach. Reaching the bottom of the page always finishes it.
       */
      const doc = document.documentElement
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2
      if (atBottom) {
        paint(1)
        return
      }

      const r = root.getBoundingClientRect()
      const travel = window.innerHeight * 0.45
      const progress = (window.innerHeight - r.top) / travel
      paint(Math.min(1, Math.max(0, progress)))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    const onEnter = () => { hovered = true; paint(1) }
    const onLeave = () => { hovered = false; measure() }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointerleave', onLeave)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <span className="u-sr-only">{lines.join(' ')}</span>
      <span className="closing__split" ref={ref} aria-hidden="true">
        {lines.map((line) => (
          <span className="closing__line" key={line}>
            {/*
              Split per word, then per character inside it. Characters alone
              would let the browser break a line mid-word on narrow screens
              ("BUIL / T"); keeping each word in its own non-breaking box
              preserves the reference's word spacing and wrapping.
            */}
            {line.split(' ').map((word, w, all) => (
              <Fragment key={`${word}-${w}`}>
                <span className="closing__word">
                  {Array.from(word).map((ch, i) => (
                    <span className="closing__char" key={i}>{ch}</span>
                  ))}
                </span>
                {/* the space lives outside the nowrap box, so it both
                    renders and remains a valid line-break opportunity */}
                {w < all.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </>
  )
}
