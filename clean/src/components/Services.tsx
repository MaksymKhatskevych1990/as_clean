import { useBookingChoice } from '../context/BookingChoice'
import { useSite } from '../context/SiteContext'
import { servicePageHref } from '../data/servicePages'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Services() {
  const { services, header } = useSite()
  const { select } = useBookingChoice()
  const { ref, visible } = useInView()

  if (!services.items.length) return null

  return (
    <section id="services" className="bg-cream py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <SectionHeading title={services.title} subtitle={services.subtitle} />
          <p className="font-display text-5xl text-gold">{String(services.items.length).padStart(2, '0')}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.items.map((service, index) => (
            <article
              key={service.title}
              className={`overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_50px_-36px_rgba(7,20,34,0.45)] ${
                visible ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              {service.image && (
                <img src={service.image} alt={service.title} className="aspect-[16/10] w-full object-cover" />
              )}
              <div className="p-6 sm:p-7">
                <p className="text-sm font-extrabold tracking-wide text-gold">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink">
                  {servicePageHref(service.title) ? (
                    <a href={servicePageHref(service.title)} className="hover:text-accent-dark">{service.title}</a>
                  ) : service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href="#booking"
                    onClick={() => select(service.title)}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-accent-dark"
                  >
                    {header.cta_text}
                    <span aria-hidden>→</span>
                  </a>
                  {servicePageHref(service.title) && (
                    <a href={servicePageHref(service.title)} className="text-sm font-bold text-ink-muted hover:text-ink">
                      Детальніше
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
