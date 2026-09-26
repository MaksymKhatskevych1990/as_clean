import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  const { contact } = useSite()
  const { ref, visible } = useInView()

  return (
    <section id="contact" className="bg-lavender/35 py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={contact.title} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div>
            {contact.cards
              .filter((card) => card.value.trim())
              .map((card) => {
              const body = (
                <div className="flex items-baseline justify-between gap-6 border-b border-ink/8 py-4">
                  <p className="eyebrow">{card.label}</p>
                  <p className="text-right font-display text-xl italic text-ink">{card.value}</p>
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
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {contact.socials
                .filter((network) => network.url)
                .map((network) => (
                <a key={network.name} href={network.url} className="text-sm text-ink-muted hover:text-ink">
                  {network.name}
                </a>
              ))}
            </div>
          </div>

          {contact.map_embed_url && (
            <div className="min-h-[280px] overflow-hidden rounded-[1.8rem] bg-sage/40">
              <iframe
                title={contact.map_title || contact.title}
                src={contact.map_embed_url}
                className="h-full min-h-[280px] w-full grayscale"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
