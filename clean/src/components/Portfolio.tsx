import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import beforeAfterMark from '../img/before-after.png'
import { BeforeAfter } from './BeforeAfter'

export function Portfolio() {
  const { portfolio } = useSite()
  const [active, setActive] = useState(portfolio.all_category_label)
  const { ref, visible } = useInView()

  const categories = [portfolio.all_category_label, ...portfolio.categories]
  const items = portfolio.items.filter((item) => item.before || item.after)
  const filtered =
    active === portfolio.all_category_label
      ? items
      : items.filter((item) => item.category === active)

  return (
    <section id="portfolio" className="py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-xl">
            <h2 className="sr-only">{portfolio.title}</h2>
            <img src={beforeAfterMark} alt={portfolio.title} className="h-24 w-auto object-contain sm:h-28" />
            {items.length > 0 && portfolio.subtitle && (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">{portfolio.subtitle}</p>
            )}
          </div>
          {items.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`pb-1 text-sm transition ${
                  active === category ? 'border-b border-ink text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          )}
        </div>

        {filtered.length > 0 && (
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {filtered.map((item, index) => (
            <article key={`${item.title}-${item.category}`} className={index % 2 === 1 ? 'md:mt-16' : undefined}>
              <BeforeAfter
                before={item.before}
                after={item.after}
                title={item.title}
                beforeLabel={portfolio.before_label}
                afterLabel={portfolio.after_label}
              />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl italic text-ink">{item.title}</h3>
                <p className="eyebrow shrink-0">{item.category}</p>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
