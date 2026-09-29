import { useSite } from '../context/SiteContext'

export function Hero() {
  const { hero, sections } = useSite()
  const hasImage = Boolean(hero.image)
  const secondaryId = hero.secondary_cta_href.startsWith('#') ? hero.secondary_cta_href.slice(1) : ''
  const secondaryVisible =
    Boolean(hero.secondary_cta_text) &&
    (secondaryId in sections ? sections[secondaryId as keyof typeof sections] : true)

  return (
    <section id="hero" className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
      <div
        className={`grid ${
          hasImage ? 'lg:min-h-[calc(100dvh-5.25rem)] lg:grid-cols-2' : 'mx-auto max-w-6xl'
        }`}
      >
        <div className="relative flex flex-col justify-center px-4 py-10 sm:px-6 lg:py-12 lg:pr-14 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          {hero.eyebrow && (
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold">{hero.eyebrow}</p>
          )}
          <h1 className="mt-3 max-w-xl font-display text-[clamp(2.05rem,3.3vw,3.35rem)] leading-[1.05] text-white">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/72">
              {hero.subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={hero.primary_cta_href} className="btn-fill">
              {hero.primary_cta_text}
            </a>
            {secondaryVisible && (
              <a href={hero.secondary_cta_href} className="btn-line">
                {hero.secondary_cta_text}
              </a>
            )}
          </div>

          {hero.badges.length > 0 && (
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {hero.badges.map((badge) => (
                <li key={badge} className="flex items-start gap-2.5 text-sm leading-snug text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[0.7rem] font-extrabold text-navy">
                    ✓
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasImage && (
          <figure className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-full lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]">
            <img
              src={hero.image}
              alt={hero.image_alt || hero.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-navy/25 lg:via-transparent lg:to-transparent" />
            {hero.caption && (
              <figcaption className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold leading-snug text-navy shadow-[0_16px_40px_-24px_rgba(7,20,34,0.8)] sm:left-auto sm:right-5 lg:bottom-8 lg:right-8">
                {hero.caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  )
}
