/**
 * An inline script that runs during HTML parsing.
 *
 * `type` is `text/javascript` on the server so the browser executes it, and
 * `text/plain` on the client so React does not warn about rendering a script
 * tag (scripts inserted by React on the client never execute anyway).
 * `suppressHydrationWarning` covers that deliberate type difference.
 *
 * This is the pattern from Next's "preventing flash before hydration" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
