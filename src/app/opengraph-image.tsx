import { ImageResponse } from 'next/og'
import { site } from '../data/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${site.name} — ${site.role}`

/**
 * Social card, generated at build time so there is no image asset to keep in
 * sync with the copy. Uses only text already in the data file.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#aca8a8', letterSpacing: '0.04em' }}>
          {site.role.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {`i’m ${site.name.toLowerCase()}`}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 110,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: '#999999',
            }}
          >
            and i make ideas work
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#b9b7b5' }}>
          {site.hero.experience.replace('\n', ' ')}
        </div>
      </div>
    ),
    size,
  )
}
