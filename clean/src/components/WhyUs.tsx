import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function WhyUs() {
  const { why_us } = useSite()
  const { ref, visible } = useInView()

  return (
    <section id="about" className="bg-lavender/40 py-20 lg:py-28">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className={`lg:sticky lg:top-28 lg:self-start ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <SectionHeading title={why_us.title} subtitle={why_us.subtitle} />
        </div>

        <dl>
          {why_us.items.map((item, index) => (
            <div
              key={item.title}
              className={`border-b border-ink/8 py-6 first:pt-0 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <dt className="font-display text-2xl italic text-ink">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
