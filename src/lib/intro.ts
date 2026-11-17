/**
 * Shared opening-intro constants.
 *
 * Like `theme.ts`, this module deliberately has no `'use client'`: the key
 * and the class name are needed by both the server-rendered inline script in
 * the root layout and the client component, and importing them from a
 * `'use client'` module into a server component gives a client reference
 * stub rather than the string.
 */
export const INTRO_KEY = 'anwurii-intro-seen'

/**
 * Set on <html> before first paint while the intro is going to run. It does
 * three jobs: locks scrolling, hides the page underneath from assistive
 * tech, and holds the hero's entrance animations at their first frame so
 * they start when the intro ends rather than behind it.
 */
export const INTRO_CLASS = 'intro-active'

/** Query flag that replays the intro. Only honoured outside production. */
export const INTRO_REPLAY_PARAM = 'intro'

/**
 * Runs synchronously in <head>, before the hero has painted a single frame.
 *
 * Deciding here rather than in React matters: by the time a client component
 * mounts, the hero's CSS animations have already started, and the visitor
 * would watch the first beats of the hero play out behind the overlay.
 */
export function introScript(allowReplay: boolean) {
  const replay = allowReplay
    ? `var r=false;try{r=new URLSearchParams(location.search).has(${JSON.stringify(
        INTRO_REPLAY_PARAM,
      )})}catch(e){}`
    : 'var r=false;'
  return `(function(){try{${replay}var m=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;var s=false;try{s=sessionStorage.getItem(${JSON.stringify(
    INTRO_KEY,
  )})==="1"}catch(e){}if(!m&&(r||!s)){document.documentElement.classList.add(${JSON.stringify(
    INTRO_CLASS,
  )})}}catch(e){}})()`
}
