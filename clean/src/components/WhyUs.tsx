import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function WhyUs() {
  const { why_us } = useSite()
  const { ref, visible } = useInView()

  return (
    <section id="about" className="bg-white py-16 lg:py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className={`lg:sticky lg:top-28 lg:self-start ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <SectionHeading title={why_us.title} subtitle={why_us.subtitle} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {why_us.items.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-[1.4rem] bg-cream p-6 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <p className="text-sm font-extrabold text-gold">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
