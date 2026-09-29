import { useEffect, useState } from 'react'
import { useSite } from '../context/SiteContext'

export function FloatingButton() {
  const { floating_button } = useSite()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <a
      href="#booking"
      className="btn-fill fixed bottom-5 right-5 z-40 shadow-[0_18px_40px_-14px_rgba(7,20,34,0.55)]"
      aria-label={floating_button}
    >
      {floating_button}
    </a>
  )
}
