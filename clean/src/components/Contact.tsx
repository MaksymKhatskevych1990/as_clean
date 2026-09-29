import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  const { contact } = useSite()
  const { ref, visible } = useInView()
  const cards = contact.cards.filter((card) => card.value.trim())
  const socials = contact.socials.filter((network) => network.url)

  return (
    <section id="contact" className="bg-white py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={contact.title} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              const body = (
                <div className="rounded-2xl bg-cream px-5 py-5 transition hover:bg-sage">
                  <p className="eyebrow">{card.label}</p>
                  <p className="mt-2 font-display text-2xl leading-tight text-ink">{card.value}</p>
                </div>
              )
              return card.href ? (
                <a key={card.label} href={card.href} className="block">
                  {body}
                </a>
              ) : (
                <div key={card.label}>{body}</div>
              )
            })}
            {socials.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {socials.map((network) => (
                  <a key={network.name} href={network.url} className="btn-ghost px-4 py-2.5 text-sm">
                    {network.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {contact.map_embed_url && (
            <div className="min-h-[300px] overflow-hidden rounded-[1.8rem] bg-cream">
              <iframe
                title={contact.map_title || contact.title}
                src={contact.map_embed_url}
                className="h-full min-h-[300px] w-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
