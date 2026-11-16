import './PerspectiveGrid.css'

type Variant = 'floor' | 'band'

interface Props {
  /** `floor` = grid receding to a vanishing point above (hero, footer).
   *  `band`  = symmetric band used behind the quote. */
  variant?: Variant
  className?: string
}

/**
 * Decorative perspective grid. Purely presentational: it carries no text and
 * is hidden from assistive technology.
 */
export function PerspectiveGrid({ variant = 'floor', className = '' }: Props) {
  return (
    <div
      className={`pgrid pgrid--${variant} ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="pgrid__plane" />
    </div>
  )
}
