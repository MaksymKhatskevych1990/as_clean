import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Pricing() {
  const { pricing } = useSite()
  const { ref, visible } = useInView()

  return (
    <section id="pricing" className="bg-cream py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={pricing.title} subtitle={pricing.subtitle} />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-[1.6rem] p-6 sm:p-7 ${
                plan.highlighted
                  ? 'bg-navy text-white shadow-[0_30px_60px_-36px_rgba(7,20,34,0.7)] md:-translate-y-2'
                  : 'border border-ink/8 bg-white text-ink'
              }`}
            >
              <h3 className="font-display text-3xl">{plan.name}</h3>
              <p className={`mt-3 font-display text-4xl ${plan.highlighted ? 'text-gold' : 'text-ink'}`}>
                {plan.price}
                <span className={`ml-2 text-base font-sans font-semibold ${plan.highlighted ? 'text-white/60' : 'text-ink-muted'}`}>
                  {plan.unit}
                </span>
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${plan.highlighted ? 'text-white/70' : 'text-ink-muted'}`}>
                {plan.description}
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-gold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#booking" className={`mt-7 ${plan.highlighted ? 'btn-fill' : 'btn-ghost'}`}>
                {plan.cta_text}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
