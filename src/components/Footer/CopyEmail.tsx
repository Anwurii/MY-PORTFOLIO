'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

type State = 'idle' | 'copied' | 'failed'

/**
 * Email chip with a copy control.
 *
 * Success and failure are both announced through a polite live region, and a
 * clipboard failure (blocked permission, insecure context, no API) falls back
 * to selecting the address so it can be copied by hand. The address itself is
 * always visible, so the control is an aid rather than the only route to it.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle')
  const addressRef = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const announce = (next: State) => {
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 4000)
  }

  const selectAddress = () => {
    const node = addressRef.current
    if (!node) return
    const range = document.createRange()
    range.selectNodeContents(node)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(email)
      announce('copied')
    } catch {
      selectAddress()
      announce('failed')
    }
  }

  return (
    <div className="footer__chip">
      <span className="footer__email" ref={addressRef}>{email}</span>
      <button
        type="button"
        className="footer__copy"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
      >
        {state === 'copied'
          ? <Check size={16} aria-hidden="true" />
          : <Copy size={16} aria-hidden="true" />}
      </button>
      <span className="u-sr-only" role="status" aria-live="polite">
        {state === 'copied' && 'Email address copied to clipboard'}
        {state === 'failed' && 'Could not copy automatically. The address is selected — copy it manually.'}
      </span>
      {state !== 'idle' && (
        <span className={`footer__toast footer__toast--${state}`} aria-hidden="true">
          {state === 'copied' ? 'Copied' : 'Select and copy'}
        </span>
      )}
    </div>
  )
}