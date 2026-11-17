import './PerspectiveGrid.css'

type Variant = 'ceiling' | 'floor'

interface Props {
  /**
   * `ceiling` — vanishing point below the layer, lines converge downward and
   * fade out as they approach it (the quote band and the footer headline).
   * `floor` — vanishing point above the layer, lines spread toward the
   * bottom edge and fade out upward (the footer contact area).
   */
  variant: Variant
  /** Vanishing point, as a fraction of the layer's height. */
  vanishY?: number
  /** Rays either side of centre. */
  rays?: number
  /** Depth lines running across. */
  depth?: number
  className?: string
}

/** Drawn in this space, then stretched to the layer by preserveAspectRatio. */
const W = 2000
const H = 1000
const CX = W / 2

/**
 * Decorative perspective grid.
 *
 * Geometry measured from design-reference/quote-section.png and
 * footer-section.png: 15 rays converging on the horizontal centre, depth
 * lines on a geometric progression toward the vanishing point, and a fade
 * that runs out at the vanishing point. The two footer treatments and the
 * quote band are the same construction mirrored, which is why they share a
 * component.
 *
 * It is SVG, so it stays crisp and scales with the section; nothing here is
 * a screenshot. It carries no text, is hidden from assistive technology and
 * never receives pointer events.
 */
export function PerspectiveGrid({
  variant,
  vanishY = variant === 'ceiling' ? 1.62 : -0.42,
  rays = 7,
  depth = 22,
  className = '',
}: Props) {
  const vy = vanishY * H
  const id = `pg-${variant}-${Math.round(vanishY * 1000)}`

  // Rays fan out from the vanishing point through evenly spaced points on
  // the edge furthest from it, then overshoot so they reach the corners.
  const farY = variant === 'ceiling' ? 0 : H
  const spread = W / (rays * 2)
  const rayLines = []
  for (let k = -rays; k <= rays; k++) {
    const fx = CX + k * spread
    // extend past the far edge so the grid always reaches the corners
    const t = 2.2
    rayLines.push({
      x1: CX + (fx - CX) * 0.02,
      y1: vy + (farY - vy) * 0.02,
      x2: CX + (fx - CX) * t,
      y2: vy + (farY - vy) * t,
      k,
    })
  }

  // Depth lines: distance from the vanishing point shrinks geometrically,
  // which is what the reference measures (≈0.957 per step).
  const ratio = 0.957
  const d0 = farY - vy
  const depthLines = []
  for (let i = 0; i < depth; i++) {
    const y = vy + d0 * Math.pow(ratio, i)
    if (y < -H || y > 2 * H) continue
    depthLines.push({ y, i })
  }

  return (
    <div className={`pgrid pgrid--${variant} ${className}`.trim()} aria-hidden="true">
      <svg
        className="pgrid__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        focusable="false"
        role="presentation"
      >
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            {variant === 'ceiling' ? (
              <>
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="78%" stopColor="#fff" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="40%" stopColor="#fff" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#fff" stopOpacity="1" />
              </>
            )}
          </linearGradient>
          {/*
            Stroke colour. The brief's two stops: #CED2DF at 0%, #FFFFFF at
            40%, held to the end so the lines never cool off again. It runs
            down the layer, the same axis as the fade, and the whole ink
            layer is held at a low opacity in CSS so this reads as a tint on
            a background detail rather than a bright graphic.
          */}
          <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CED2DF" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect x="0" y="0" width={W} height={H} fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`} stroke={`url(#${id}-ink)`} className="pgrid__lines">
          {/*
            Every other ray and depth line is marked `--alt` and dropped at
            phone width. Stretched into a narrow viewport the full set reads
            as dense hatching that fights the copy; half of it keeps the same
            geometry while staying a background.
          */}
          {rayLines.map((l) => (
            <line
              key={`r${l.k}`}
              className={Math.abs(l.k) % 2 === 1 ? 'pgrid__alt' : undefined}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
            />
          ))}
          {depthLines.map((l) => (
            <line
              key={`d${l.i}`}
              className={l.i % 2 === 1 ? 'pgrid__alt' : undefined}
              x1={0}
              y1={l.y}
              x2={W}
              y2={l.y}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
