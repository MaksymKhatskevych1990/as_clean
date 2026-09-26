import { useSite } from '../context/SiteContext'
import { useCounter } from '../hooks/useCounter'
import { useInView } from '../hooks/useInView'

function StatItem({
  value,
  suffix,
  label,
  active,
  decimals,
}: {
  value: number
  suffix: string
  label: string
  active: boolean
  decimals: number
}) {
  const count = useCounter(decimals ? Math.round(value * 10 ** decimals) : value, active)
  const display = decimals ? (count / 10 ** decimals).toFixed(decimals) : count.toLocaleString('uk-UA')

  return (
    <div className="px-2 py-6 text-center sm:px-6">
      <p className="font-display text-4xl italic text-ink sm:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-xs tracking-wide text-ink-muted">{label}</p>
    </div>
  )
}

export function Statistics() {
  const { stats } = useSite()
  const { ref, visible } = useInView()

  return (
    <section className="bg-peach/45">
      <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-ink/8 sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            decimals={stat.decimals}
            active={visible}
          />
        ))}
      </div>
    </section>
  )
}
