import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

export function FAQ() {
  const { faq } = useSite()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { ref, visible } = useInView()

  return (
    <section className="py-20 lg:py-28">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={faq.title} />
        </div>

        <div>
          {faq.items.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={item.question} className="border-b border-ink/8">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span className="font-display text-xl italic text-ink">{item.question}</span>
                  <span className="mt-1 text-sm text-ink-muted">{open ? '–' : '+'}</span>
                </button>
                {open && (
                  <p className="pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
