const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

export async function fetchSite() {
  const response = await fetch(apiUrl('/api/site/'), { signal: AbortSignal.timeout(4000) })
  if (!response.ok) {
    throw new Error('Не вдалося завантажити контент')
  }
  return response.json()
}

export async function submitBooking(data: FormData) {
  const response = await fetch(apiUrl('/api/bookings/'), {
    method: 'POST',
    body: data,
  })
  if (!response.ok) {
    throw new Error('Не вдалося надіслати заявку')
  }
  return response.json()
}
