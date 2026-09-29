import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from 'lucide-react'
import { submitBooking } from '../api/client'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'

type FormFields = {
  name: string
  phone: string
  email: string
  address: string
  property_type: string
  area: string
  cleaning_type: string
  date: string
  time: string
  comment: string
}

const initial: FormFields = {
  name: '',
  phone: '',
  email: '',
  address: '',
  property_type: '',
  area: '',
  cleaning_type: '',
  date: '',
  time: '',
  comment: '',
}

export function BookingForm() {
  const { booking, hero } = useSite()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormFields>(initial)
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const { ref, visible } = useInView()

  const update = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setPending(true)
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))
    photos.forEach((file) => payload.append('photos', file))
    try {
      await submitBooking(payload)
      setSubmitted(true)
    } catch {
      setError('Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.')
    } finally {
      setPending(false)
    }
  }

  if (submitted) {
    return (
      <section id="booking" className="bg-[#e7eef8] py-20 lg:py-28">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="rounded-[1.8rem] bg-white px-6 py-14 shadow-[0_30px_80px_-40px_rgba(7,20,34,0.45)]">
            <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
            <h2 className="mt-6 font-display text-4xl text-ink">{booking.success_title}</h2>
            <p className="mt-4 text-ink-muted">{booking.success_text.replace('{name}', form.name)}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="bg-[#e7eef8] py-16 lg:py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <aside className={`rounded-[1.8rem] bg-navy p-7 text-white sm:p-9 lg:sticky lg:top-24 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <h2 className="font-display text-4xl leading-[1.02] text-white sm:text-5xl">
            {booking.title}
          </h2>
          {hero.badges.length > 0 && (
            <ul className="mt-8 space-y-3">
              {hero.badges.map((badge) => (
                <li key={badge} className="flex items-start gap-3 text-sm leading-snug text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[0.7rem] font-extrabold text-navy">
                    ✓
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </aside>

        <form
          onSubmit={onSubmit}
          className="rounded-[1.8rem] bg-white p-6 shadow-[0_30px_80px_-42px_rgba(7,20,34,0.55)] sm:p-8"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {booking.steps.map((label, i) => (
              <div key={label}>
                <div className={`h-1.5 rounded-full ${i <= step ? 'bg-gold' : 'bg-ink/10'}`} />
                <p className={`mt-2 text-xs font-bold ${i === step ? 'text-ink' : 'text-ink-muted'}`}>
                  {i + 1}. {label}
                </p>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.name_label}</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder={booking.name_placeholder}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.phone_label}</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder={booking.phone_placeholder}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.email_label}</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder={booking.email_placeholder}
                  className="field"
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.address_label}</span>
                <input
                  required
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder={booking.address_placeholder}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.property_type_label}</span>
                <select
                  required
                  value={form.property_type}
                  onChange={(e) => update('property_type', e.target.value)}
                  className="field"
                >
                  <option value="">{booking.property_type_placeholder}</option>
                  {booking.property_types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.area_label}</span>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.area}
                  onChange={(e) => update('area', e.target.value)}
                  placeholder={booking.area_placeholder}
                  className="field"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.cleaning_type_label}</span>
                <select
                  required
                  value={form.cleaning_type}
                  onChange={(e) => update('cleaning_type', e.target.value)}
                  className="field"
                >
                  <option value="">{booking.cleaning_type_placeholder}</option>
                  {booking.cleaning_types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.date_label}</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.time_label}</span>
                <select
                  required
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  className="field"
                >
                  <option value="">{booking.time_placeholder}</option>
                  {booking.time_slots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.comment_label}</span>
                <textarea
                  rows={4}
                  value={form.comment}
                  onChange={(e) => update('comment', e.target.value)}
                  placeholder={booking.comment_placeholder}
                  className="field"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">{booking.photos_label}</span>
                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-cream px-6 py-10">
                  <Upload className="h-7 w-7 text-accent-dark" />
                  <span className="mt-3 text-sm font-bold text-ink">{booking.photos_hint}</span>
                  <span className="mt-1 text-xs text-ink-muted">
                    {photos.length ? `${photos.length} файл(ів)` : booking.photos_note}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={booking.photos_label}
                    onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
                  />
                </div>
              </label>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-ghost"
              >
                <ArrowLeft className="h-4 w-4" />
                {booking.back_text}
              </button>
            ) : (
              <div />
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="btn-fill"
              >
                {booking.next_text}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={pending}
                className="btn-fill disabled:opacity-60"
              >
                {pending ? 'Надсилаємо…' : booking.submit_text}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
