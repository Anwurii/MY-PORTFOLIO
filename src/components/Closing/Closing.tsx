import Image from 'next/image'
import { site } from '../../data/site'
import { Figma, GitHub, OpenAI, Claude } from '../Brand/BrandMarks'
import { Reveal } from '../Reveal/Reveal'
import { FooterHeadline } from './FooterHeadline'
import './Closing.css'

/**
 * Closing band: the headline and the fanned sticker row.
 *
 * Card order, rotation and stacking follow the reference: Figma, GitHub, the
 * portrait in the centre and in front, ChatGPT, Claude. The group sits low in
 * a clipped container so only the upper part of each card shows above the
 * footer divider, and it rises into that position on entering the viewport.
 */
/*
 * `drop` fans the group downward at the edges, with the portrait highest.
 * It is a percentage of the card's own height, so the fan keeps its shape
 * when the cards shrink on small screens.
 */
const stickers = [
  { id: 'figma', node: <Figma />, rotate: -14, drop: 13 },
  { id: 'github', node: <GitHub />, rotate: -7, drop: 6 },
  { id: 'portrait', node: null, rotate: 0, drop: 0 },
  { id: 'openai', node: <OpenAI />, rotate: 7, drop: 6 },
  { id: 'claude', node: <Claude />, rotate: 14, drop: 13 },
]

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <h2 id="closing-title" className="closing__title">
        <FooterHeadline lines={site.closing.heading} />
      </h2>

      <Reveal
        effect="none"
        className="closing__stickers"
        role="img"
        aria-label="Figma, GitHub, Anwurii, ChatGPT and Claude"
      >
        {stickers.map((s, i) => (
          <span
            className={`closing__card${s.id === 'portrait' ? ' closing__card--portrait' : ''}`}
            key={s.id}
            style={{
              '--rot': `${s.rotate}deg`,
              '--drop': `${s.drop}%`,
              '--i': i,
              zIndex: s.id === 'portrait' ? 10 : 5 - Math.abs(i - 2),
            } as React.CSSProperties}
          >
            {s.id === 'portrait' ? (
              <Image src={site.images.portrait} alt="" width={372} height={340} />
            ) : (
              s.node
            )}
          </span>
        ))}
      </Reveal>
    </section>
  )
}
