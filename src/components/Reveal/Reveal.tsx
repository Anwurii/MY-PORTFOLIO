'use client'

import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'
import './Reveal.css'

interface Props {
  children: ReactNode
  /** ms */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  /**
   * `rise` (default) uses the shared fade-and-lift. `none` only toggles
   * `is-in`, so the caller can define its own entrance without fighting the
   * default transform — see the Selected Work heading.
   */
  effect?: 'rise' | 'none'
  /** anything else the host element needs (id, role, aria-*) */
  [key: string]: unknown
}

/**
 * Gentle section entrance: a short opacity and position reveal the first time
 * the element scrolls into view. Under prefers-reduced-motion (or without
 * IntersectionObserver) it renders in its final state straight away — the
 * content is always in the DOM and never depends on the animation running.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
  effect = 'rise',
  ...rest
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      className={`${effect === 'rise' ? 'reveal' : ''}${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}