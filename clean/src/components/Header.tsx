import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import logo from '../img/logo.png'

export function Header() {
  const { header } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const brand = `${header.brand_primary} ${header.brand_accent}`.trim()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#hero" className="flex min-w-0 shrink-0 items-center">
          <img src={logo} alt={brand || 'AS clean'} className="h-14 w-auto object-contain sm:h-[4.25rem]" />
        </a>

        <nav className="hidden min-w-0 items-center justify-center gap-4 xl:flex" aria-label="Головна навігація">
          {header.nav.filter((link) => link.href !== '#hero').map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.8rem] tracking-wide text-ink-muted transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 xl:block">
          <a href="#booking" className="btn-fill px-4 py-2.5">
            {header.cta_text}
          </a>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink xl:hidden"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/8 bg-cream/95 px-4 py-5 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Мобільна навігація">
            {header.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#booking" className="btn-fill mt-2" onClick={() => setOpen(false)}>
              {header.cta_text}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
