'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { site } from '../../data/site'
import { INTRO_CLASS, INTRO_KEY, INTRO_REPLAY_PARAM } from '../../lib/intro'
import './Intro.css'

const { intro } = site
const WORDS = intro.beats
const SHOTS = intro.shots

/* ---------------------------------------------------------------------- *
 * The sequence, transcribed from the supplied screen recording.
 *
 * Frames were pulled at 60ms and measured: every cut is full-bleed, the
 * words and photographs alternate, and the cuts accelerate — 420ms down to
 * 180ms. The reference's words are vertically centred and scaled to the
 * viewport width; this build uses the specified fixed 100px instead.
 * ---------------------------------------------------------------------- */
type Cut = { word?: number; shot?: number; ms: number; invert?: boolean }

/** 4.08s → 6.30s in the recording: the readable run of the headline. */
const OPENING: Cut[] = [
  { word: 0, ms: 420 },
  { shot: 0, ms: 360 },
  { word: 1, ms: 300 },
  { shot: 1, ms: 240 },
  { word: 2, ms: 240 },
  { shot: 2, ms: 180 },
  { word: 3, ms: 180 },
  { shot: 3, ms: 180 },
  { word: 4, ms: 240 },
]

/**
 * 6.36s → 7.74s: the same material cutting roughly every 60ms while the
 * frame squeezes shut from both edges toward the centre. Every third cut in
 * the recording flips to inverted colour, which is kept here.
 */
const FLICKER_MS = 60
const FLICKER_COUNT = 20
const SQUEEZE_MS = FLICKER_MS * FLICKER_COUNT

const FLICKER: Cut[] = Array.from({ length: FLICKER_COUNT }, (_, i) => ({
  ...(i % 2 === 0 ? { shot: i % SHOTS.length } : { word: i % WORDS.length }),
  ms: FLICKER_MS,
  invert: i % 3 === 2,
}))

/* ---------------------------------------------------------------------- *
 * Type scale.
 *
 * The reference sets every word to the width of the viewport, which is why
 * NEED and PORSCHE both reach edge to edge and why the measured ink height
 * runs from 0.371 to 0.769 of the viewport depending on how many letters
 * the word has. Two of them — FOR and MY — come up against a ceiling at
 * 0.769, so there is a height cap as well as a width target.
 *
 * So each word needs its own size, derived from how wide it is per em.
 * These are Helvetica Neue Bold at -0.02em; they are only the first-paint
 * fallback, because the real widths are measured on mount — Windows and
 * Android fall back to Arial, whose metrics differ enough to leave a gap at
 * the edge if these numbers were trusted everywhere.
 */
const EM_WIDTH: Record<string, number> = {
  NEED: 2.609,
  MONEY: 3.601,
  FOR: 1.946,
  MY: 1.494,
  PORSCHE: 4.72,
}
const FALLBACK_EM = 2.6

const CUTS = [...OPENING, ...FLICKER]
const RUN_MS = CUTS.reduce((t, c) => t + c.ms, 0)

/** 7.80s: a beat of black, then the frame opens again onto the homepage. */
const BLACK_MS = 80
const OPEN_MS = 480
const TOTAL_MS = RUN_MS + BLACK_MS + OPEN_MS

/* ---------------------------------------------------------------------- *
 * Whether the intro runs is browser state — a session flag, a motion
 * preference, and in development a query flag — so the server cannot know
 * it. Reading it during render would break hydration, so it goes through an
 * external store whose server snapshot is "no". The inline script in the
 * root layout has already made the same decision before first paint; this
 * only has to agree with it.
 * ---------------------------------------------------------------------- */
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/**
 * The development replay flag is good for exactly one run. Without this the
 * flag stays true after the sequence ends, the gate keeps saying "play", and
 * the finished overlay never unmounts.
 */
let replayUsed = false

function getSnapshot() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (process.env.NODE_ENV !== 'production' && !replayUsed) {
    try {
      if (new URLSearchParams(window.location.search).has(INTRO_REPLAY_PARAM)) return true
    } catch {
      /* ignored */
    }
  }
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true // storage blocked; it is only a nicety
  }
}
const getServerSnapshot = () => false

export function Intro() {
  const shouldPlay = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const markSeen = useCallback(() => {
    replayUsed = true
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* ignored */
    }
    listeners.forEach((l) => l())
  }, [])

  /*
   * The inline script adds the class before paint. If the component decides
   * not to play after all — reduced motion, a second visit in this session —
   * the class has to come off or the page stays locked and the hero stays
   * frozen at its first frame.
   */
  useEffect(() => {
    if (!shouldPlay) document.documentElement.classList.remove(INTRO_CLASS)
  }, [shouldPlay])

  if (!shouldPlay) return null
  return <IntroSequence onFinish={markSeen} />
}

/**
 * Black ground, white type, photographs full-bleed between the words, then
 * the frame squeezes shut and opens again onto the homepage — which has been
 * mounted underneath the whole time, so there is nothing to load at the
 * handover and nothing flashes.
 *
 * Every exit path converges on one `finish()`:
 *  - the sequence runs to its end;
 *  - Escape, Enter, Space or the Skip button end it immediately;
 *  - a hard timeout ends it even if a transition event never arrives;
 *  - the cleanup unlocks the page whatever tore the component down.
 *
 * The timeline is time-driven, never load-driven, so a photograph that fails
 * to arrive costs its own cut and nothing else — the intro still ends and
 * the homepage still appears.
 */
function IntroSequence({ onFinish }: { onFinish: () => void }) {
  const [cut, setCut] = useState(0)
  const [phase, setPhase] = useState<'run' | 'squeeze' | 'open'>('run')
  const [failed, setFailed] = useState<Set<number>>(() => new Set())
  const stageRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const done = useRef(false)

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('open')
    // the page is usable again the moment the frame starts opening
    document.documentElement.classList.remove(INTRO_CLASS)
    timers.current.push(window.setTimeout(onFinish, OPEN_MS))
  }, [onFinish])

  /*
   * Measure the real widths before the first word is painted, so the type
   * fills the viewport whichever face the system actually resolved.
   */
  useLayoutEffect(() => {
    const nodes = stageRef.current?.querySelectorAll<HTMLElement>('.intro__word')
    if (!nodes) return
    try {
      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return
      const probe = 200
      const face = getComputedStyle(document.documentElement).getPropertyValue('--font-sans')
      ctx.font = `700 ${probe}px ${face || 'Helvetica Neue, Helvetica, Arial, sans-serif'}`
      ctx.letterSpacing = `${-0.02 * probe}px`
      nodes.forEach((node, i) => {
        const m = ctx.measureText(WORDS[i])
        const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
        // written straight to the node: this is a measurement, not state,
        // and nothing about the sequence depends on re-rendering for it
        if (width > 0) node.style.setProperty('--em', String(width / probe))
      })
    } catch {
      /* the fallback widths rendered inline are already in place */
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add(INTRO_CLASS)
    skipRef.current?.focus({ preventScroll: true })

    const push = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

    let at = 0
    CUTS.forEach((c, i) => {
      if (i > 0) push(() => setCut(i), at)
      at += c.ms
    })
    // the squeeze runs under the flicker, as a single transition
    push(() => setPhase('squeeze'), RUN_MS - SQUEEZE_MS)
    push(finish, RUN_MS + BLACK_MS)

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
      // never leave the page locked or the hero frozen, whatever unmounted us
      document.documentElement.classList.remove(INTRO_CLASS)
    }
  }, [finish])

  const current = CUTS[Math.min(cut, CUTS.length - 1)]

  return (
    <div
      className={`intro is-${phase}${current.invert ? ' is-inverted' : ''}`}
      role="presentation"
      style={
        {
          '--squeeze-ms': `${SQUEEZE_MS}ms`,
          '--open-ms': `${OPEN_MS}ms`,
        } as CSSProperties
      }
    >
      {/* the accessible version of the whole sequence, read once */}
      <p className="u-sr-only">{intro.headline}</p>

      <div className="intro__stage" ref={stageRef} aria-hidden="true">
        {SHOTS.map((s, i) => (
          <div
            key={s.src}
            className={`intro__shot${current.shot === i && !failed.has(i) ? ' is-on' : ''}`}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority
              sizes="100vw"
              onError={() => setFailed((f) => new Set(f).add(i))}
            />
          </div>
        ))}

        {WORDS.map((w, i) => (
          <p
            key={w}
            className={`intro__word${current.word === i ? ' is-on' : ''}`}
            style={{ '--em': EM_WIDTH[w] ?? FALLBACK_EM } as CSSProperties}
          >
            {w}
          </p>
        ))}
      </div>

      {/* The exit: two panels part from the centre, uncovering the homepage. */}
      <span className="intro__shutter intro__shutter--top" aria-hidden="true" />
      <span className="intro__shutter intro__shutter--bottom" aria-hidden="true" />

      <button ref={skipRef} type="button" className="intro__skip" onClick={finish}>
        {intro.skip}
      </button>
    </div>
  )
}

export { TOTAL_MS as INTRO_TOTAL_MS }
