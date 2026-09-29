export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  light = false,
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'right'
  light?: boolean
}) {
  return (
    <div className={align === 'right' ? 'ml-auto max-w-xl text-right' : 'max-w-xl'}>
      <span className={`mb-4 block h-1 w-12 rounded-full bg-gold ${align === 'right' ? 'ml-auto' : ''}`} />
      <h2 className={`font-display text-4xl leading-[1.02] sm:text-5xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-[0.98rem] leading-relaxed ${light ? 'text-white/70' : 'text-ink-muted'}`}>{subtitle}</p>
      )}
    </div>
  )
}
