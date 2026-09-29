import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <p className="text-lg tracking-wider text-gold" aria-label={`${filled} з 5`}>
      {'★'.repeat(filled)}
      <span className="text-ink/15">{'★'.repeat(5 - filled)}</span>
    </p>
  )
}

export function Testimonials() {
  const { testimonials, header } = useSite()
  const [index, setIndex] = useState(0)
  const { ref, visible } = useInView()
  const items = testimonials.items
  const item = items[index]

  if (!item) return null

  return (
    <section id="testimonials" className="bg-white py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className={`flex items-end justify-between gap-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">{testimonials.title}</h2>
          <span className="text-sm font-extrabold text-ink-muted">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <blockquote className="mt-8 rounded-[1.8rem] bg-cream px-6 py-8 sm:px-10 sm:py-12">
          <Stars rating={item.rating} />
          <p className="mt-5 max-w-3xl font-display text-3xl leading-snug text-ink sm:text-4xl">
            «{item.text}»
          </p>
          <footer className="mt-8">
            <p className="text-sm font-extrabold text-ink">{item.name}</p>
            <p className="text-sm text-ink-muted">{item.role}</p>
          </footer>
        </blockquote>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Попередній відгук"
              onClick={() => setIndex((i) => (i === 0 ? items.length - 1 : i - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Наступний відгук"
              onClick={() => setIndex((i) => (i === items.length - 1 ? 0 : i + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <a href="#booking" className="btn-fill">
            {header.cta_text}
          </a>
        </div>
      </div>
    </section>
  )
}
