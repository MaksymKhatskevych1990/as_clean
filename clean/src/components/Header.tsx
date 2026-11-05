import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicePages } from '../data/servicePages'
import logo from '../img/logo.webp'

export function Header() {
  const { header } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const brand = `${header.brand_primary} ${header.brand_accent}`.trim()
  const onHome = window.location.pathname === '/'
  const navHref = (href: string) => onHome || !href.startsWith('#') ? href : `/${href}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-ink/8 bg-white/95 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-[0_10px_30px_-24px_rgba(7,20,34,0.7)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <a href={onHome ? '#hero' : '/'} className="flex min-w-0 shrink-0 items-center">
          <img src={logo} alt={brand || 'AS clean'} className="h-14 w-auto object-contain sm:h-16" />
        </a>

        <nav className="hidden min-w-0 items-center justify-center gap-6 lg:flex" aria-label="Головна навігація">
          {header.nav.filter((link) => link.href !== '#hero').map((link) => (
            link.href === '#services' ? (
              <div key={link.href} className="group relative">
                <a
                  href={navHref(link.href)}
                  className="flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
                >
                  {link.label}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden />
                </a>
                <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-ink/8 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(7,20,34,0.35)]">
                    {servicePages.map((page) => (
                      <a
                        key={page.slug}
                        href={`/${page.slug}/`}
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink-muted transition hover:bg-cream hover:text-ink"
                      >
                        {page.serviceName}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={navHref(link.href)}
                className="text-sm font-semibold text-ink-muted transition hover:text-ink"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <a href="#booking" className="btn-fill px-5 py-2.5 text-sm">
            {header.cta_text}
          </a>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink lg:hidden"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/8 bg-white px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Мобільна навігація">
            {header.nav.map((link) => (
              <div key={link.href}>
                <a
                  href={navHref(link.href)}
                  className="block rounded-xl px-2 py-3 text-base font-semibold text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
                {link.href === '#services' && (
                  <div className="mb-2 ml-3 border-l border-ink/10 pl-3">
                    {servicePages.map((page) => (
                      <a
                        key={page.slug}
                        href={`/${page.slug}/`}
                        className="block rounded-lg px-2 py-2 text-sm font-semibold text-ink-muted"
                        onClick={() => setOpen(false)}
                      >
                        {page.serviceName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="#booking" className="btn-fill mt-3" onClick={() => setOpen(false)}>
              {header.cta_text}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
