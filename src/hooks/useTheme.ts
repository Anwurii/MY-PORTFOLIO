'use client'

import { useCallback, useSyncExternalStore } from 'react'

import { THEME_KEY, DEFAULT_THEME, type Theme } from '../lib/theme'

export type { Theme }

/**
 * Theme state.
 *
 * The page is prerendered, so the server cannot know which theme a visitor
 * chose last time. An inline script applies the stored theme to
 * `<html data-theme>` before first paint, and that attribute is the single
 * source of truth — this hook reads it rather than keeping a second copy.
 *
 * `useSyncExternalStore` is what makes this hydration-safe: React uses the
 * server snapshot (`'dark'`, matching the prerendered HTML) for the first
 * client render, then re-reads the real value after hydrating. Reading
 * localStorage during render instead would make the first render depend on
 * browser state the server could not know, which fails hydration and forces
 * the whole tree to re-render on the client.
 */

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Must match what the server rendered on <html>. */
function getServerSnapshot(): Theme {
  return DEFAULT_THEME
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* storage blocked — the theme still applies for this session */
    }
    listeners.forEach((l) => l())
  }, [])

  return { theme, toggle }
}
