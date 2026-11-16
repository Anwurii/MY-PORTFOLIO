'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '../../data/site'
import { useTheme } from '../../hooks/useTheme'
import { ComposeIcon, SunIcon, MoonIcon } from './NavIcons'
import './Nav.css'

/**
 * Compact centred navigation, measured from the reference at the 1512px
 * design frame: a 683.4 × 76.4 pill, 3px border, 20px radius, 31px from the
 * top, with a 45px monogram tile and an 80.1 × 39.3 icon group inset 15.9px
 * from each end. It keeps those pixel dimensions above 1512px rather than
 * growing with the viewport.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
  }, [open])

  const mailto = site.email ? `mailto:${site.email}` : null

  return (
    <header className="nav" role="banner">
      <nav className="nav__bar" aria-label="Primary">
        <a className="nav__monogram" href="#top" aria-label={`${site.name} — back to top`}>
          {site.monogram}
        </a>

        <ul className="nav__links">
          {site.nav.map((item) =>
            item.href === null ? (
              <li key={item.label}>
                <span className="nav__link nav__link--off" aria-disabled="true">
                  {item.label}
                  <span className="u-sr-only"> (file not supplied yet)</span>
                </span>
              </li>
            ) : (
              <li key={item.label}>
                <a className="nav__link" href={item.href}>{item.label}</a>
              </li>
            ),
          )}
        </ul>

        <div className="nav__icons">
          {mailto ? (
            <a className="nav__icon" href={mailto} aria-label={`Email ${site.name}`}>
              <ComposeIcon />
            </a>
          ) : (
            <span className="nav__icon nav__icon--off" aria-hidden="true"><ComposeIcon /></span>
          )}
          <span className="nav__icon-divider" aria-hidden="true" />
          {/* Both marks are rendered and CSS shows the one matching
              <html data-theme>. The attribute is set before first paint, so
              the correct icon is painted immediately without this depending
              on React state — which would not match the server's HTML. */}
          <button
            type="button"
            className="nav__icon nav__icon--theme"
            onClick={toggle}
            aria-pressed={theme === 'light'}
            aria-label="Light theme"
          >
            <span className="nav__theme-mark nav__theme-mark--sun"><SunIcon /></span>
            <span className="nav__theme-mark nav__theme-mark--moon"><MoonIcon /></span>
          </button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
          <span className="u-sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      <div ref={panelRef} id={menuId} className="nav__panel" hidden={!open}>
        <ul>
          {site.nav.map((item) =>
            item.href === null ? (
              <li key={item.label}>
                <span className="nav__panel-link nav__link--off" aria-disabled="true">
                  {item.label}
                  <span className="u-sr-only"> (file not supplied yet)</span>
                </span>
              </li>
            ) : (
              <li key={item.label}>
                <a className="nav__panel-link" href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        <div className="nav__panel-actions">
          {mailto && (
            <a className="nav__panel-link nav__panel-link--row" href={mailto}>
              <span>Email me</span>
              <span className="nav__panel-icon" aria-hidden="true"><ComposeIcon /></span>
            </a>
          )}
          <button
            type="button"
            className="nav__panel-link nav__panel-link--row"
            onClick={toggle}
            aria-pressed={theme === 'light'}
          >
            <span>Light theme</span>
            <span className="nav__panel-icon" aria-hidden="true">
              <span className="nav__theme-mark nav__theme-mark--sun"><SunIcon /></span>
              <span className="nav__theme-mark nav__theme-mark--moon"><MoonIcon /></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}