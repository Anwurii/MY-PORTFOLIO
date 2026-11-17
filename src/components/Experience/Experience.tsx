import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '../../data/site'
import { Reveal } from '../Reveal/Reveal'
import './Experience.css'

const { experience, resumeUrl } = site

/**
 * Selected experience.
 *
 * Measured from the supplied experience reference (2000px wide for the 1512
 * design frame, so image px / 1.32275 = CSS px):
 *
 *   column dividers   328.9 · 684.2 · 1028.2   → 21.75 / 23.5 / 22.75 / 32 %
 *   outer inset       68          inner cell inset 15
 *   header row        56.7 tall, 26px, #999999
 *   data rows         137.6 min, cells bottom-aligned on a shared baseline
 *   body              26px/1.18, white; contribution the same size, regular
 *   label / link      30px — #aca8a8, and white underlined
 *
 * Rules are full-bleed; the three dividers run the height of the table.
 *
 * It is a server component: the hover preview is pure CSS, so nothing here
 * needs to run in the browser. The table is expressed with ARIA grid roles
 * rather than <table>, because at phone width every row restacks into a
 * labelled block and a real table does not restack cleanly.
 */
export function Experience() {
  const [headA, headB] = experience.heading

  return (
    <section className="exp" id="experience" aria-labelledby="exp-title">
      <div className="exp__head">
        <Reveal as="div" className="exp__intro">
          <p className="exp__label">{experience.label}</p>
          <ResumeLink />
        </Reveal>

        <Reveal as="h2" id="exp-title" className="exp__title" delay={90}>
          <span className="exp__title-line">{headA}</span>
          <span className="exp__title-line">{headB}</span>
        </Reveal>
      </div>

      <div className="exp__table" role="table" aria-label={experience.label}>
        <div className="exp__rowgroup" role="rowgroup">
          <div className="exp__row exp__row--head" role="row">
            {experience.columns.map((c) => (
              <span className="exp__cell exp__colhead" role="columnheader" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="exp__rowgroup" role="rowgroup">
          {experience.rows.map((r, i) => (
            <Reveal
              as="div"
              role="row"
              key={r.id}
              delay={i * 90}
              className="exp__row"
              style={{ '--preview-left': r.previewLeft } as CSSProperties}
            >
              <span className="exp__cell exp__cell--company" role="cell">
                <span className="exp__k">{experience.columns[0]}</span>
                <span className="exp__v">{r.company}</span>
                <Preview row={r} />
              </span>

              <Cell label={experience.columns[1]}>{r.role}</Cell>
              <Cell label={experience.columns[2]}>{r.timeline}</Cell>
              <Cell label={experience.columns[3]} variant="contrib">
                {r.contribution}
              </Cell>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cell({
  label,
  children,
  variant,
}: {
  label: string
  children: string
  variant?: 'contrib'
}) {
  return (
    <span className={`exp__cell${variant ? ` exp__cell--${variant}` : ''}`} role="cell">
      <span className="exp__k">{label}</span>
      <span className="exp__v">{children}</span>
    </span>
  )
}

/**
 * The hover/focus preview.
 *
 * It lives inside the row, so moving the pointer off the row text and onto
 * the image keeps `:hover` on the row and the preview stays up long enough
 * to be clicked. It is never `display: none` or `visibility: hidden`, which
 * would take it out of the tab order — it is transparent and inert until the
 * row is hovered or the link itself is focused.
 */
function Preview({ row }: { row: (typeof experience.rows)[number] }) {
  if (!row.caseStudySlug || !row.previewImage) return null
  return (
    <Link className="exp__preview" href={`/work/${row.caseStudySlug}`}>
      <span className="exp__preview-media">
        <Image
          className="exp__preview-img"
          src={row.previewImage}
          alt={row.previewAlt}
          fill
          sizes="189px"
        />
      </span>
      <span className="exp__preview-cta">{experience.previewCta}</span>
      {row.previewIsPlaceholder ? (
        <span className="u-sr-only"> — artwork not supplied yet</span>
      ) : null}
    </Link>
  )
}

/**
 * No resume file has been supplied (`public/resume/` is empty and
 * `site.resumeUrl` is null), so this renders as text rather than a link that
 * would 404. Drop a PDF in `public/resume/` and set `resumeUrl` to turn it
 * into a real link — nothing else here changes.
 */
function ResumeLink() {
  if (!resumeUrl) {
    return (
      <span className="exp__resume is-unavailable">
        {experience.resumeLabel}
        <span className="u-sr-only"> (file not supplied yet)</span>
      </span>
    )
  }
  return (
    <a className="exp__resume" href={resumeUrl} target="_blank" rel="noopener noreferrer">
      {experience.resumeLabel}
    </a>
  )
}
