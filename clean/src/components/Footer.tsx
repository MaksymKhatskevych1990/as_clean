import { useSite } from '../context/SiteContext'
import logo from '../img/logo.webp'

export function Footer() {
  const { footer, header } = useSite()

  return (
    <footer className="bg-navy text-white">
      <div className="h-1 bg-gold" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <a href="#hero" className="inline-block rounded-2xl bg-white p-2">
              <img
                src={logo}
                alt={`${footer.brand_primary} ${footer.brand_accent}`.trim() || 'AS clean'}
                className="h-20 w-auto object-contain"
              />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {footer.tagline}
            </p>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold">{footer.nav_title}</p>
            <ul className="mt-4 space-y-2">
              {header.nav.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold">{footer.services_title}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {footer.services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {footer.copyright_name}</p>
          <div className="flex gap-5">
            {footer.privacy_url && footer.privacy_url !== '#' && (
              <a href={footer.privacy_url} className="hover:text-white">{footer.privacy_label}</a>
            )}
            {footer.terms_url && footer.terms_url !== '#' && (
              <a href={footer.terms_url} className="hover:text-white">{footer.terms_label}</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
