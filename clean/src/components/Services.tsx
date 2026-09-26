import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Services() {
  const { services } = useSite()
  const { ref, visible } = useInView()

  if (!services.items.length) return null

  return (
    <section id="services" className="bg-sage/35 py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <SectionHeading title={services.title} subtitle={services.subtitle} />
          <p className="eyebrow">{String(services.items.length).padStart(2, '0')}</p>
        </div>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {services.items.map((service, index) => {
            const reverse = index % 2 === 1
            return (
              <article
                key={service.title}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  visible ? 'opacity-100' : 'opacity-0'
                } transition-opacity`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {service.image && (
                  <div className={reverse ? 'lg:order-2' : undefined}>
                    <div className="overflow-hidden rounded-[1.6rem] bg-peach/30">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="aspect-[5/4] w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className={reverse ? 'lg:order-1' : undefined}>
                  <p className="font-display text-3xl italic text-accent-dark">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-4xl italic leading-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
                    {service.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
