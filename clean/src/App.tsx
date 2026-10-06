import { lazy, Suspense } from 'react'
import { BookingForm } from './components/BookingForm'
import { Contact } from './components/Contact'
import { FloatingButton } from './components/FloatingButton'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Seo } from './components/Seo'
import { SiteProvider, useSite } from './context/SiteContext'

const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })))
const WhyUs = lazy(() => import('./components/WhyUs').then((m) => ({ default: m.WhyUs })))
const Statistics = lazy(() => import('./components/Statistics').then((m) => ({ default: m.Statistics })))
const Portfolio = lazy(() => import('./components/Portfolio').then((m) => ({ default: m.Portfolio })))
const VideoGallery = lazy(() => import('./components/VideoGallery').then((m) => ({ default: m.VideoGallery })))
const Pricing = lazy(() => import('./components/Pricing').then((m) => ({ default: m.Pricing })))
const Testimonials = lazy(() => import('./components/Testimonials').then((m) => ({ default: m.Testimonials })))
const FAQ = lazy(() => import('./components/FAQ').then((m) => ({ default: m.FAQ })))

function Page() {
  const { sections } = useSite()

  return (
    <>
      <Seo />
      <Header />
      <main>
        {sections.hero && <Hero />}
        <Suspense fallback={null}>
          {sections.services && <Services />}
          {sections.why_us && <WhyUs />}
          {sections.stats && <Statistics />}
          {sections.portfolio && <Portfolio />}
          {sections.videos && <VideoGallery />}
          {sections.pricing && <Pricing />}
          {sections.testimonials && <Testimonials />}
          {sections.faq && <FAQ />}
        </Suspense>
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
