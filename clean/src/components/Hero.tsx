import { useSite } from '../context/SiteContext'

export function Hero() {
  const { hero } = useSite()
  const hasImage = Boolean(hero.image)

  return (
    <section id="hero" className="relative flex h-dvh max-h-dvh flex-col overflow-hidden pt-[5.75rem] pb-5 sm:pt-24 sm:pb-7">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-sage/50 blur-3xl" aria-hidden />
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        {hero.eyebrow && <p className="eyebrow mb-3 shrink-0 sm:mb-4">{hero.eyebrow}</p>}

        <div
          className={`grid min-h-0 flex-1 items-center gap-4 sm:gap-8 lg:gap-12 ${
            hasImage ? 'sm:grid-cols-[1.15fr_0.85fr]' : ''
          }`}
        >
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(1.85rem,4.6vw,3.85rem)] leading-[1.08] text-ink">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted sm:mt-4 sm:text-base">
                {hero.subtitle}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
              <a href={hero.primary_cta_href} className="btn-fill">
                {hero.primary_cta_text}
              </a>
              <a href={hero.secondary_cta_href} className="btn-ghost">
                {hero.secondary_cta_text}
              </a>
            </div>
          </div>

          {hasImage && (
            <figure className="relative mx-auto flex h-full min-h-0 w-full max-w-md items-center lg:mx-0 lg:max-w-none lg:justify-self-end">
              <div className="relative mx-auto w-[min(100%,18rem)] sm:w-[min(100%,22rem)] lg:w-full">
                <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-lavender/70" aria-hidden />
                <div className="relative overflow-hidden rounded-[1.4rem] bg-white p-2">
                  <img
                    src={hero.image}
                    alt={hero.image_alt || hero.title}
                    className="max-h-[min(28dvh,14rem)] w-full rounded-[1.05rem] object-cover sm:max-h-[min(48dvh,22rem)] lg:max-h-[min(54dvh,26rem)] [@media(max-height:44rem)]:max-h-[min(32dvh,16rem)]"
                  />
                </div>
                {hero.caption && (
                  <figcaption className="relative mt-3 hidden text-center font-display text-sm italic text-ink-muted lg:block lg:text-left">
                    {hero.caption}
                  </figcaption>
                )}
              </div>
            </figure>
          )}
        </div>

        {hero.badges.length > 0 && (
          <ul className="mt-4 flex shrink-0 flex-wrap gap-x-6 gap-y-2 border-t border-ink/8 pt-3 sm:mt-5 sm:pt-4">
            {hero.badges.map((badge) => (
              <li key={badge} className="text-xs text-ink-muted sm:text-sm">
                <span className="mr-2 text-accent-dark">+</span>
                {badge}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
