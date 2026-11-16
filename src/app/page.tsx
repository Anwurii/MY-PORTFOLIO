import { Nav } from '../components/Nav/Nav'
import { Hero } from '../components/Hero/Hero'
import { Ticker } from '../components/Ticker/Ticker'
import { SelectedWork } from '../components/SelectedWork/SelectedWork'
import { Quote } from '../components/Quote/Quote'
import { Faq } from '../components/Faq/Faq'
import { Closing } from '../components/Closing/Closing'
import { Footer } from '../components/Footer/Footer'

export default function HomePage() {
  return (
    <>
      <a className="u-skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <SelectedWork />
        <Quote />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
