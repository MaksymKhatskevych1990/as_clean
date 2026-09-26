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
  const { booking } = useSite()
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
      <section id="booking" className="bg-sage/40 py-24 lg:py-32">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <CheckCircle2 className="mx-auto h-14 w-14 text-accent-dark" />
          <h2 className="mt-6 font-display text-4xl italic text-ink">{booking.success_title}</h2>
          <p className="mt-4 text-ink-muted">{booking.success_text.replace('{name}', form.name)}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="bg-sage/40 py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
          <h2 className="font-display text-4xl italic text-ink sm:text-5xl">
            {booking.title}
          </h2>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {booking.steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  i <= step ? 'bg-peach text-ink' : 'bg-white/70 text-ink-muted'
                }`}
              >
                {i + 1}
              </span>
              <span className={`hidden text-sm sm:inline ${i <= step ? 'text-ink' : 'text-ink-muted'}`}>
                {label}
              </span>
              {i < booking.steps.length - 1 && <div className="mx-2 hidden h-px w-8 bg-sage sm:block" />}
            </div>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-[1.8rem] bg-white/70 p-6 sm:p-10"
        >
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.name_label}</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder={booking.name_placeholder}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.phone_label}</span>
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
                <span className="mb-2 block text-sm font-medium text-ink">{booking.email_label}</span>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.address_label}</span>
                <input
                  required
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder={booking.address_placeholder}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.property_type_label}</span>
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
                <span className="mb-2 block text-sm font-medium text-ink">{booking.area_label}</span>
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
                <span className="mb-2 block text-sm font-medium text-ink">{booking.cleaning_type_label}</span>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.date_label}</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.time_label}</span>
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
                <span className="mb-2 block text-sm font-medium text-ink">{booking.comment_label}</span>
                <textarea
                  rows={4}
                  value={form.comment}
                  onChange={(e) => update('comment', e.target.value)}
                  placeholder={booking.comment_placeholder}
                  className="field"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-ink">{booking.photos_label}</span>
                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-peach/25 px-6 py-10">
                  <Upload className="h-7 w-7 text-accent-dark" />
                  <span className="mt-3 text-sm font-medium text-ink">{booking.photos_hint}</span>
                  <span className="mt-1 text-xs text-ink/50">
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

          <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
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
