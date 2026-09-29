import { BookingForm } from './components/BookingForm'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { FloatingButton } from './components/FloatingButton'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { Pricing } from './components/Pricing'
import { Seo } from './components/Seo'
import { Services } from './components/Services'
import { Statistics } from './components/Statistics'
import { Testimonials } from './components/Testimonials'
import { VideoGallery } from './components/VideoGallery'
import { WhyUs } from './components/WhyUs'
import { SiteProvider, useSite } from './context/SiteContext'

function Page() {
  const { sections } = useSite()

  return (
    <>
      <Seo />
      <Header />
      <main>
        {sections.hero && <Hero />}
        {sections.services && <Services />}
        {sections.why_us && <WhyUs />}
        {sections.stats && <Statistics />}
        {sections.portfolio && <Portfolio />}
        {sections.videos && <VideoGallery />}
        {sections.pricing && <Pricing />}
        {sections.testimonials && <Testimonials />}
        {sections.faq && <FAQ />}
        {sections.booking && <BookingForm />}
        {sections.contact && <Contact />}
      </main>
      <Footer />
      {sections.booking && <FloatingButton />}
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <Page />
    </SiteProvider>
  )
}
