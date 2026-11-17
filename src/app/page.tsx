import { Nav } from '../components/Nav/Nav'
import { Hero } from '../components/Hero/Hero'
import { Ticker } from '../components/Ticker/Ticker'
import { SelectedWork } from '../components/SelectedWork/SelectedWork'
import { Experience } from '../components/Experience/Experience'
import { Quote } from '../components/Quote/Quote'
import { Faq } from '../components/Faq/Faq'
import { Closing } from '../components/Closing/Closing'
import { Footer } from '../components/Footer/Footer'
import { Intro } from '../components/Intro/Intro'

export default function HomePage() {
  return (
    <>
      {/* Homepage only — a return from a case study is the same session,
          so the intro does not replay. */}
      <Intro />
      <a className="u-skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <SelectedWork />
        <Experience />
        <Quote />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
