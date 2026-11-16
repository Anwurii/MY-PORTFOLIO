/**
 * The two marks in the nav's right-hand group, traced from
 * design-reference/hero-reference.png: a rounded square with a pen (compose a
 * message) and a sun (light theme). Stroke weight and proportions follow the
 * reference; see ASSET-CHECKLIST.md — no icon exports were supplied.
 */

export function ComposeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 12.6v4.7a3.2 3.2 0 0 1-3.2 3.2H6.7a3.2 3.2 0 0 1-3.2-3.2V6.7a3.2 3.2 0 0 1 3.2-3.2h4.8" />
      <path d="M3.9 7.2 11 12a1.9 1.9 0 0 0 2.1 0l2.4-1.6" />
      <path d="m17.4 3.6 3 3-5.1 5.1-3.4.4.4-3.4z" />
    </svg>
  )
}

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.6v2.1M12 19.3v2.1M21.4 12h-2.1M4.7 12H2.6M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5M18.6 18.6l-1.5-1.5M6.9 6.9 5.4 5.4" />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8" />
    </svg>
  )
}
