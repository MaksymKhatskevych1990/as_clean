export function SectionHeading({
  title,
  subtitle,
  align = 'left',
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'right'
}) {
  return (
    <div className={align === 'right' ? 'ml-auto max-w-xl text-right' : 'max-w-xl'}>
      <h2 className="font-display text-4xl italic leading-tight text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">{subtitle}</p>}
    </div>
  )
}
