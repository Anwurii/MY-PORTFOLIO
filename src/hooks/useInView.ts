import { useEffect, useRef, useState } from 'react'

/**
 * Marks an element once the page has reached it, so a CSS class can run a
 * one-off entrance.
 *
 * Content is never left hidden:
 *  - reduced motion, or no IntersectionObserver → revealed immediately;
 *  - the observer handles the ordinary case of scrolling into view;
 *  - a scroll backstop handles the case the observer cannot. An observer only
 *    reports threshold crossings, so a page that jumps — an anchor link, or
 *    back-to-top — can carry an element from below the viewport to above it
 *    with no intersecting frame in between, and no callback at all. Without
 *    the backstop that content would stay invisible for the rest of the visit.
 *  - a watchdog covers an observer that never delivers its first callback.
 *
 * Every listener removes itself as soon as the element is revealed.
 */
export function useInView<T extends HTMLElement>(rootMargin = '-10% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!node || reduced || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    let done = false
    let frame = 0
    let delivered = false

    const finish = () => {
      if (done) return
      done = true
      setInView(true)
      cleanup()
    }

    const check = () => {
      frame = 0
      if (!done && node.getBoundingClientRect().top < window.innerHeight) finish()
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        delivered = true
        if (entry.isIntersecting) finish()
      },
      { rootMargin },
    )

    const watchdog = window.setTimeout(() => {
      if (!delivered) finish()
    }, 1200)

    function cleanup() {
      io.disconnect()
      window.clearTimeout(watchdog)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }

    io.observe(node)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return cleanup
  }, [rootMargin])

  return { ref, inView }
}
