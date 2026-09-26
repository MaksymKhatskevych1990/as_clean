import { useSite } from '../context/SiteContext'

export function FloatingButton() {
  const { floating_button } = useSite()

  return (
    <a
      href="#booking"
      className="btn-fill fixed bottom-5 right-5 z-40 inline-flex shadow-none"
      aria-label={floating_button}
    >
      {floating_button}
    </a>
  )
}
