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
import { SiteProvider } from './context/SiteContext'

export default function App() {
  return (
    <SiteProvider>
      <Seo />
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Statistics />
        <Portfolio />
        <VideoGallery />
        <Pricing />
        <Testimonials />
        <FAQ />
        <BookingForm />
        <Contact />
      </main>
      <Footer />
      <FloatingButton />
    </SiteProvider>
  )
}
