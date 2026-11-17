'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import './ResumeModal.css'

const { experience, resumeUrl } = site
const copy = experience.resume

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), object, iframe'

/**
 * "See more experience", and the résumé dialog it opens.
 *
 * The button and the dialog are one client component so the rest of the
 * section can stay a server component.
 *
 * The dialog rises from below the fold and settles in the middle. Closing is
 * possible four ways — the close button, the backdrop, Escape, and a second
 * press of the trigger — and all of them run through one `close()`, which
 * unlocks the page and puts focus back on the button that opened it.
 *
 * Scrolling is locked with `overflow: hidden` on <body> rather than by
 * repositioning it, so the homepage is still at the same offset underneath
 * and the visitor returns exactly where they were.
 */
export function ResumeModal() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!open) return

    document.documentElement.classList.add('modal-open')

    // focus the first thing inside, not the page behind
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })

    /*
     * Flip into the settled position a tick after mount, so the rise is a
     * transition rather than a keyframe animation. A keyframe holds its
     * from-state for as long as the browser considers it running, which in
     * a throttled tab parks the panel off the bottom of the screen
     * indefinitely; a timer still fires there, so this always settles.
     */
    const rise = window.setTimeout(() => panel?.classList.add('is-in'), 20)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      // keep Tab inside the dialog
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el.tagName === 'OBJECT',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(rise)
      document.removeEventListener('keydown', onKey)
      // never leave the page locked, whatever closed or unmounted us
      document.documentElement.classList.remove('modal-open')
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="exp__cta"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {experience.cta}
      </button>

      {open ? (
        <div
          className="rmodal"
          /* a click that starts and ends on the backdrop closes; one that
             begins inside the panel and drifts out does not */
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div
            ref={panelRef}
            className="rmodal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rmodal-title"
          >
            <div className="rmodal__bar">
              <h2 id="rmodal-title" className="rmodal__title">
                {copy.title}
              </h2>
              <div className="rmodal__actions">
                {resumeUrl ? (
                  <a className="rmodal__action" href={resumeUrl} download>
                    {copy.download}
                  </a>
                ) : null}
                <button type="button" className="rmodal__close" onClick={close}>
                  {copy.close}
                </button>
              </div>
            </div>

            <div className="rmodal__body">
              {resumeUrl ? (
                /*
                 * <object> renders the browser's own PDF viewer and shows its
                 * own children when it cannot — no third-party viewer, and a
                 * real link for anyone whose browser will not embed it.
                 */
                <object
                  className="rmodal__doc"
                  data={resumeUrl}
                  type="application/pdf"
                  aria-label={copy.title}
                >
                  <p className="rmodal__fallback">
                    <a className="rmodal__action" href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      {copy.open}
                    </a>
                  </p>
                </object>
              ) : (
                <p className="rmodal__missing">{copy.missing}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
