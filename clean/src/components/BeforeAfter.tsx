import { useCallback, useRef, useState, type PointerEvent } from 'react'

type BeforeAfterProps = {
  before: string
  after: string
  title: string
  beforeLabel: string
  afterLabel: string
}

export function BeforeAfter({ before, after, title, beforeLabel, afterLabel }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(52)
  const dragging = useRef(false)

  const moveTo = useCallback((clientX: number) => {
    const node = frame.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setValue(Math.min(88, Math.max(12, next)))
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    moveTo(event.clientX)
  }

  const stopDrag = () => {
    dragging.current = false
  }

  if (!before && !after) return null

  return (
    <div
      ref={frame}
      className="compare group relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-navy"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      {after && (
        <img
          src={after}
          alt={`${afterLabel}: ${title}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      )}
      {before && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${beforeLabel}: ${title}`}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>
      )}

      <span className="compare-chip left-3">{beforeLabel}</span>
      <span className="compare-chip right-3">{afterLabel}</span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90"
        style={{ left: `${value}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-navy shadow-[0_8px_24px_-12px_rgba(7,20,34,0.55)]">
          <span className="text-xs tracking-widest">↔</span>
        </span>
      </div>

      <input
        type="range"
        min={12}
        max={88}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="compare-range"
        aria-label={`${beforeLabel} / ${afterLabel}: ${title}`}
      />
    </div>
  )
}
