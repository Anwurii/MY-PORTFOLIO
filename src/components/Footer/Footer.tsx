import Image from 'next/image'
import { site } from '../../data/site'
import { PerspectiveGrid } from '../PerspectiveGrid/PerspectiveGrid'
import { brandMap } from '../Brand/brandMap'
import { CopyEmail } from './CopyEmail'
import { BackToTop } from './BackToTop'
import './Footer.css'

/**
 * Footer.
 *
 * Measured at the 1512 frame: container 104 → 1408, divider at y 3816 (the
 * stickers overlap it from above), the avatar row at 3858, the socials and
 * email row at 3937, a second divider at 4028.5 and the credit row at 4063.9.
 *
 * No social destinations have been verified, so those four render as
 * non-interactive marks rather than links that go nowhere.
 */
export function Footer() {
  const { socials, footer, closing, email, name, images } = site

  return (
    <footer className="footer" id="contact">
      <PerspectiveGrid variant="floor" className="footer__grid" />

      <div className="footer__inner">
        <hr className="footer__rule" />

        <div className="footer__row footer__row--top">
          <div className="footer__more">
            <Image
              className="footer__avatar"
              src={images.portrait}
              alt=""
              width={104}
              height={104}
            />
            <span>{closing.moreLabel}</span>
          </div>

          <BackToTop />

          <p className="footer__contact-label">{closing.contactLabel}</p>
        </div>

        <div className="footer__row footer__row--links">
          <ul className="footer__socials">
            {socials.map((s) => {
              const Mark = brandMap[s.id]
              return (
                <li key={s.id}>
                  {s.href ? (
                    <a
                      className="footer__social"
                      href={s.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                    >
                      {Mark && <Mark />}
                      <span className="u-sr-only">{s.label} (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="footer__social footer__social--off">
                      {Mark && <Mark />}
                      <span className="u-sr-only">{s.label} — link not supplied yet</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>

          {email && <CopyEmail email={email} />}
        </div>

        <hr className="footer__rule footer__rule--low" />

        <div className="footer__row footer__row--credits">
          <p>{footer.credit}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>

      <span className="u-sr-only">{name}</span>
    </footer>
  )
}
