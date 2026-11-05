import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useBookingChoice } from '../context/BookingChoice'
import { servicePages, type ServicePage } from '../data/servicePages'
import { BookingForm } from './BookingForm'
import { Contact } from './Contact'
import { Footer } from './Footer'
import { Header } from './Header'

function setMeta(selector: string, content: string) {
  const element = document.head.querySelector(selector)
  element?.setAttribute('content', content)
}

function ServiceSeo({ page }: { page: ServicePage }) {
  useEffect(() => {
    const url = `https://asclean.dp.ua/${page.slug}/`
    document.title = page.title
    setMeta('meta[name="description"]', page.description)
    setMeta('meta[property="og:title"]', page.title)
    setMeta('meta[property="og:description"]', page.description)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[property="og:image"]', page.image)
    setMeta('meta[name="twitter:title"]', page.title)
    setMeta('meta[name="twitter:description"]', page.description)
    setMeta('meta[name="twitter:image"]', page.image)
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', url)

    const script = document.getElementById('ld-service-static') ?? document.createElement('script')
    script.id = 'ld-service-static'
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: page.heading,
          description: page.description,
          serviceType: page.serviceName,
          image: page.image,
          areaServed: {
            '@type': 'City',
            name: 'Дніпро',
          },
          provider: {
            '@type': 'HouseCleaner',
            '@id': 'https://asclean.dp.ua/#business',
            name: 'AS clean',
            url: 'https://asclean.dp.ua/',
            telephone: '+380635429553',
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'UAH',
            description: page.price,
            url,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: page.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://asclean.dp.ua/' },
            { '@type': 'ListItem', position: 2, name: page.serviceName, item: url },
          ],
        },
      ],
    })
    if (!script.parentNode) document.head.appendChild(script)
  }, [page])

  return null
}

export function ServiceLanding({ page }: { page: ServicePage }) {
  const { select } = useBookingChoice()

  useEffect(() => {
    select(page.serviceName)
  }, [page.serviceName, select])

  return (
    <>
      <ServiceSeo page={page} />
      <Header />
      <main>
        <section id="hero" className="overflow-hidden bg-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <nav aria-label="Хлібні крихти" className="text-sm text-white/60">
                <a href="/" className="hover:text-white">Головна</a>
                <span className="px-2" aria-hidden>/</span>
                <span>{page.serviceName}</span>
              </nav>
              <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-gold">{page.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{page.heading}</h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{page.lead}</p>
              <p className="mt-6 font-display text-2xl text-gold">{page.price}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#booking" className="btn-fill">Розрахувати вартість</a>
                <a href="tel:+380635429553" className="btn-line">+380 63 542 95 53</a>
              </div>
            </div>
            <img
              src={page.image}
              alt={page.imageAlt}
              width="1200"
              height="900"
              fetchPriority="high"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl"
            />
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
            <article className="rounded-[1.6rem] bg-cream p-7 sm:p-9">
              <p className="eyebrow">Що входить</p>
              <h2 className="mt-3 font-display text-3xl text-ink">Основні роботи</h2>
              <ul className="mt-6 space-y-4">
                {page.included.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.6rem] bg-peach p-7 sm:p-9">
              <p className="eyebrow">Кому підходить</p>
              <h2 className="mt-3 font-display text-3xl text-ink">Коли замовляють</h2>
              <ul className="mt-6 space-y-4">
                {page.suitableFor.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-sm leading-relaxed text-ink-muted">
                Остаточний перелік робіт залежить від стану приміщення. Менеджер уточнить деталі й назве вартість до приїзду команди.
              </p>
            </article>
          </div>
        </section>

        <section id="faq" className="bg-cream py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="eyebrow">Відповіді</p>
              <h2 className="mt-3 font-display text-4xl text-ink">Питання про послугу</h2>
            </div>
            <div>
              {page.faq.map((item, index) => (
                <details key={item.question} open={index === 0} className="group border-b border-ink/10 py-5">
                  <summary className="cursor-pointer list-none pr-8 font-display text-xl text-ink marker:hidden">
                    {item.question}
                  </summary>
                  <p className="pt-4 pr-8 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow">Інші послуги</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Прибирання у Дніпрі</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {servicePages.filter((item) => item.slug !== page.slug).map((item) => (
                <a key={item.slug} href={`/${item.slug}/`} className="btn-ghost">
                  {item.serviceName}
                </a>
              ))}
            </div>
          </div>
        </section>

        <BookingForm />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
