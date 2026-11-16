'use client'

import { ArrowUp } from 'lucide-react'

/** Scrolls to the top, honouring the visitor's motion preference. */
export function BackToTop() {
  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.getElementById('top')?.focus?.()
  }

  return (
    <button type="button" className="footer__totop" onClick={toTop}>
      <ArrowUp size={18} aria-hidden="true" />
      <span className="u-sr-only">Back to top</span>
    </button>
  )
}