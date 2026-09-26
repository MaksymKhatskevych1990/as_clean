import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'

export function Testimonials() {
  const { testimonials } = useSite()
  const [index, setIndex] = useState(0)
  const { ref, visible } = useInView()
  const items = testimonials.items
  const item = items[index]

  if (!item) return null

  return (
    <section id="testimonials" className="bg-butter/50 py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className={`flex items-end justify-between gap-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="font-display text-4xl italic text-ink sm:text-5xl">{testimonials.title}</h2>
          <span className="eyebrow hidden sm:inline">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <blockquote className="mt-12 max-w-3xl">
          <p className="font-display text-3xl leading-snug italic text-ink sm:text-4xl">
            «{item.text}»
          </p>
          <footer className="mt-8">
            <p className="text-sm font-medium text-ink">{item.name}</p>
            <p className="text-sm text-ink-muted">{item.role}</p>
          </footer>
        </blockquote>

        <div className="mt-10 flex gap-3">
          <button
            type="button"
            aria-label="Попередній відгук"
            onClick={() => setIndex((i) => (i === 0 ? items.length - 1 : i - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Наступний відгук"
            onClick={() => setIndex((i) => (i === items.length - 1 ? 0 : i + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-ink"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
