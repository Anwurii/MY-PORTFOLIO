'use client'

import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

/** Interactive things the cursor should react to. */
const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]'
/** Where a text caret matters more than a decorative dot. */
const TEXT_ENTRY = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]'

/**
 * Small white dot that follows the pointer with a spring, and swells a little
 * over links and buttons.
 *
 * It never runs unless the device actually suits it: a fine pointer that can
 * hover, and no reduced-motion preference. The native cursor is only hidden
 * once this has mounted and painted a frame, so a failure here can never
 * leave a visitor with no pointer at all. Over text fields the dot hides and
 * the real caret comes back.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)

  // Only enable for fine, hovering pointers without a motion preference.
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

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let scale = 1
    let targetScale = 1
    let frame = 0
    let painted = false

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!painted) return
      const el = e.target as Element | null
      const overText = !!el?.closest?.(TEXT_ENTRY)
      dot.classList.toggle('is-hidden', overText)
      targetScale = !overText && el?.closest?.(INTERACTIVE) ? 1.9 : 1
    }

    const onLeave = () => dot.classList.add('is-hidden')
    const onEnter = () => dot.classList.remove('is-hidden')
    const onDown = () => { targetScale *= 0.8 }
    const onUp = () => { targetScale = targetScale < 1 ? 1 : targetScale }

    // Critically damped-ish follow: position eases, scale springs a little.
    const tick = () => {
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      scale += (targetScale - scale) * 0.2
      // translate(-50%, -50%) keeps the dot's centre on the pointer
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
      if (!painted) {
        painted = true
        document.documentElement.classList.add('has-custom-cursor')
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return <div className="cursor is-hidden" ref={dotRef} aria-hidden="true" />
}
