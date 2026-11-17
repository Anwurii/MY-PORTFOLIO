'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import './Intro.css'

/** Shown once per browser session, not on every return from a case study. */
const SESSION_KEY = 'anwurii-intro-seen'

const BEATS = ['PRODUCT', 'DESIGNER', 'ANWURII'] as const
const BEAT_MS = 380
const HOLD_MS = 520
const EXIT_MS = 340

/* ---------------------------------------------------------------------- *
 * Whether the intro should run at all is browser state — a session flag and
 * a motion preference — so the server cannot know it. Reading it during
 * render would break hydration, so it goes through an external store whose
 * server snapshot is "no". The server renders nothing, the client agrees on
 * the first pass, and the intro only appears after hydration.
 * ---------------------------------------------------------------------- */
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
function getSnapshot() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return true // storage blocked; it is only a nicety
  }
}
const getServerSnapshot = () => false

export function Intro() {
  const shouldPlay = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const markSeen = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignored */
    }
    listeners.forEach((l) => l())
  }, [])

  if (!shouldPlay) return null
  return <IntroSequence onFinish={markSeen} />
}

/**
 * The sequence itself: black ground, white type, one word at a time, then a
 * clean wipe into the existing hero. The hero is untouched and renders
 * underneath the whole time.
 *
 * Every exit path converges on one `finish()`:
 *  - a hard timeout ends it even if no transition event ever arrives;
 *  - Escape, Enter, Space or the Skip button end it immediately;
 *  - scroll is locked only while it is on screen, and the cleanup removes
 *    that lock whatever tore the component down;
 *  - focus moves to Skip but is never trapped — Tab leaves freely.
 */
function IntroSequence({ onFinish }: { onFinish: () => void }) {
  const [beat, setBeat] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const skipRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const done = useRef(false)

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    timers.current.forEach(clearTimeout)
    timers.current = []
    document.documentElement.classList.remove('intro-locked')
    setLeaving(true)
    timers.current.push(window.setTimeout(onFinish, EXIT_MS))
  }, [onFinish])

  useEffect(() => {
    document.documentElement.classList.add('intro-locked')
    skipRef.current?.focus({ preventScroll: true })

    const push = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    push(() => setBeat(1), BEAT_MS)
    push(() => setBeat(2), BEAT_MS * 2)
    push(finish, BEAT_MS * 2 + HOLD_MS) // the hard stop

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        finish()
      }
    }
    document.addEventListener('keydown', onKey)

    const t = timers
    return () => {
      document.removeEventListener('keydown', onKey)
      t.current.forEach(clearTimeout)
      t.current = []
      // never leave the page locked, whatever unmounted us
      document.documentElement.classList.remove('intro-locked')
    }
  }, [finish])

  return (
    <div
      className={`intro${leaving ? ' is-leaving' : ''}`}
      role="presentation"
      style={{ '--exit-ms': `${EXIT_MS}ms` } as React.CSSProperties}
    >
      <p className="intro__word" aria-hidden="true">
        {BEATS.map((w, i) => (
          <span
            key={w}
            className={`intro__beat${i === beat ? ' is-on' : ''}${i === 2 ? ' intro__beat--name' : ''}`}
          >
            {w}
          </span>
        ))}
      </p>

      <button ref={skipRef} type="button" className="intro__skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  )
}
