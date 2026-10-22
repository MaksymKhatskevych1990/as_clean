import { useEffect, useRef, useState } from 'react'
import { useBookingChoice } from '../context/BookingChoice'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

const PEEK = 92

function visibleCount(width: number) {
  if (width >= 1024) return 4
  if (width >= 640) return 2
  return 1
}

export function Pricing() {
  const { pricing } = useSite()
  const { select } = useBookingChoice()
  const { ref, visible } = useInView()
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false })
  const frame = useRef(0)
  const [width, setWidth] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const plans = pricing.plans
  const perView = visibleCount(width)
  const itemWidth = width > 0 ? (width - (plans.length > perView ? PEEK : 0)) / perView : 0
  const maxScroll = Math.max(0, plans.length * itemWidth - width)
  const stops = itemWidth
    ? [...new Set(plans.map((_, i) => Math.round(Math.min(i * itemWidth, maxScroll))))]
    : [0]
  const activeStop = stops.reduce((best, stop) =>
    Math.abs(stop - scrollLeft) < Math.abs(best - scrollLeft) ? stop : best,
  )
  const atStart = scrollLeft <= 2
  const atEnd = scrollLeft >= maxScroll - 2

  useEffect(() => {
    const element = scroller.current
    if (!element) return
    const update = () => setWidth(element.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const goTo = (left: number) => {
    const element = scroller.current
    if (!element) return
    cancelAnimationFrame(frame.current)
    const start = element.scrollLeft
    const change = left - start
    if (Math.abs(change) < 1) return
    const duration = 320
    const started = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - progress) ** 3
      element.scrollLeft = start + change * eased
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  const stepBy = (direction: -1 | 1) => {
    const current = scroller.current?.scrollLeft ?? scrollLeft
    const next = direction > 0
      ? stops.find((stop) => stop > current + 2)
      : [...stops].reverse().find((stop) => stop < current - 2)
    if (next === undefined) return
    goTo(next)
  }

  return (
    <section id="pricing" className="bg-cream py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={pricing.title} subtitle={pricing.subtitle} />
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            className="absolute top-1/2 -left-2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-xl text-white shadow-[0_12px_30px_-16px_rgba(7,20,34,0.8)] transition hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-0 sm:-left-5"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => stepBy(-1)}
            disabled={atStart}
            aria-label="Попередні ціни"
          >
            ←
          </button>
          <button
            type="button"
            className="absolute top-1/2 -right-2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-xl text-white shadow-[0_12px_30px_-16px_rgba(7,20,34,0.8)] transition hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-0 sm:-right-5"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => stepBy(1)}
            disabled={atEnd}
            aria-label="Наступні ціни"
          >
            →
          </button>

          <div
            ref={scroller}
            className="cursor-grab overflow-x-auto rounded-[1.75rem] bg-white active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="карусель"
            aria-label={pricing.title}
            onScroll={(event) => setScrollLeft(event.currentTarget.scrollLeft)}
            onPointerDown={(event) => {
              const element = scroller.current
              if (!element || event.button !== 0) return
              drag.current = {
                active: true,
                startX: event.clientX,
                startScroll: element.scrollLeft,
                moved: false,
              }
              element.setPointerCapture(event.pointerId)
            }}
            onPointerMove={(event) => {
              const element = scroller.current
              if (!element || !drag.current.active) return
              const delta = event.clientX - drag.current.startX
              if (Math.abs(delta) > 6) drag.current.moved = true
              element.scrollLeft = drag.current.startScroll - delta
            }}
            onPointerUp={() => {
              if (!drag.current.active) return
              const moved = drag.current.moved
              drag.current.active = false
              if (!moved) return
              const nearest = stops.reduce((best, stop) =>
                Math.abs(stop - (scroller.current?.scrollLeft ?? 0)) < Math.abs(best - (scroller.current?.scrollLeft ?? 0))
                  ? stop
                  : best,
              )
              goTo(nearest)
            }}
            onClickCapture={(event) => {
              if (!drag.current.moved) return
              event.preventDefault()
              event.stopPropagation()
              drag.current.moved = false
            }}
          >
            <div className="flex items-stretch">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className="flex shrink-0 flex-col border-r border-ink/10 px-5 py-7 last:border-r-0 sm:px-6"
                  style={{ width: itemWidth || undefined }}
                >
                  <h3 className="min-h-[2.5em] font-display text-2xl leading-tight text-ink">{plan.name}</h3>
                  <p className="mt-3 font-display text-4xl leading-none text-navy">
                    {plan.price}
                    <span className="ml-2 text-base font-sans font-semibold tracking-normal text-ink-muted">
                      {plan.unit}
                    </span>
                  </p>
                  {plan.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">{plan.description}</p>
                  )}
                  {plan.features.length > 0 && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{plan.features.join(' · ')}</p>
                  )}
                  <a
                    href="#booking"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => select(plan.name)}
                    className="mt-auto inline-flex pt-4 text-sm font-extrabold text-accent-dark"
                  >
                    {plan.cta_text} →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>

        {stops.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Позиція каруселі">
            {stops.map((stop) => (
              <button
                key={stop}
                type="button"
                role="tab"
                aria-selected={stop === activeStop}
                aria-label={`Показати ціни з позиції ${stops.indexOf(stop) + 1}`}
                className={`h-2 rounded-full transition-all ${stop === activeStop ? 'w-6 bg-navy' : 'w-2 bg-ink/20'}`}
                onClick={() => goTo(stop)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
