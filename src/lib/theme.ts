/**
 * Shared theme constants.
 *
 * This module deliberately has no `'use client'`. The key is needed by both
 * the server-rendered inline script in the root layout and the client hook,
 * and importing it from a `'use client'` module into a server component does
 * not give you the string — it gives you a client reference stub, which
 * silently serialises into the script as a function that throws.
 */
export const THEME_KEY = 'anwurii-theme'

export type Theme = 'dark' | 'light'

/** The theme the server renders on <html>, and the fallback. */
export const DEFAULT_THEME: Theme = 'dark'

/**
 * Runs synchronously in <head> during HTML parsing, before first paint, so a
 * visitor who chose light never sees a dark flash.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}})()`
