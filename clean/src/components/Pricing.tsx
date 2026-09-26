import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Pricing() {
  const { pricing } = useSite()
  const { ref, visible } = useInView()

  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`lg:flex lg:items-end lg:justify-between ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <SectionHeading title={pricing.title} subtitle={pricing.subtitle} />
        </div>

        <div className="mt-14 space-y-4">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={`grid gap-6 rounded-[1.8rem] px-6 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:px-8 ${
                plan.highlighted ? 'bg-peach/70' : 'bg-white/60'
              }`}
            >
              <div>
                <h3 className="font-display text-3xl italic text-ink">{plan.name}</h3>
                <p className="mt-1 font-display text-2xl text-ink">
                  {plan.price} <span className="text-base text-ink-muted">{plan.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-ink-muted">{plan.description}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <a href="#booking" className={plan.highlighted ? 'btn-fill justify-self-start' : 'btn-ghost justify-self-start'}>
                {plan.cta_text}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
