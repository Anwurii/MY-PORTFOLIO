'use client'

import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]'
const TEXT_ENTRY = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]'

/**
 * Small white dot that follows the pointer.
 *
 * Position is written straight from the pointer coordinates — no easing, no
 * trailing — so the dot sits exactly under the pointer. The only thing that
 * animates is a quick scale when the pointer is over something interactive.
 *
 * It writes `transform` directly on the node from one rAF loop, so pointer
 * movement never triggers a React render, and the loop only does work on
 * frames where something actually changed. There is no CSS transition on
 * `transform`; a transition there is what made the old version feel heavy.
 *
 * Only runs for a fine, hovering pointer with no reduced-motion preference,
 * and the native cursor is hidden only after the first frame is painted, so
 * a failure here can never leave a visitor with no pointer at all.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const queries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(prefers-reduced-motion: no-preference)'),
    ]
    const evaluate = () => setEnabled(queries.every((q) => q.matches))
    evaluate()
    queries.forEach((q) => q.addEventListener('change', evaluate))
    return () => queries.forEach((q) => q.removeEventListener('change', evaluate))
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    if (!enabled || !dot) return

    let x = 0
    let y = 0
    let scale = 1
    let targetScale = 1
    let dirty = false
    let painted = false
    let frame = 0

    const render = () => {
      frame = requestAnimationFrame(render)
      // scale is the only eased value, and it settles fast
      const nextScale = scale + (targetScale - scale) * 0.3
      const scaleChanged = Math.abs(nextScale - scale) > 0.001
      if (!dirty && !scaleChanged) return
      scale = scaleChanged ? nextScale : targetScale
      dirty = false
      // position is written verbatim — the dot is exactly under the pointer
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
      if (!painted) {
        painted = true
        dot.classList.remove('is-hidden')
        document.documentElement.classList.add('has-custom-cursor')
      }
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      dirty = true
      const el = e.target as Element | null
      if (el?.closest?.(TEXT_ENTRY)) {
        dot.classList.add('is-over-text')
        targetScale = 1
      } else {
        dot.classList.remove('is-over-text')
        targetScale = el?.closest?.(INTERACTIVE) ? 1.8 : 1
      }
    }

    const onLeave = () => dot.classList.add('is-hidden')
    const onEnter = () => { if (painted) dot.classList.remove('is-hidden') }

    frame = requestAnimationFrame(render)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return <div className="cursor is-hidden" ref={dotRef} aria-hidden="true" />
}
