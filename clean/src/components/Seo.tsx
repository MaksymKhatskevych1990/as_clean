import { useEffect } from 'react'
import { useSite } from '../context/SiteContext'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    document.head.appendChild(element)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function Seo() {
  const { seo, contact, header } = useSite()

  useEffect(() => {
    if (seo.title) document.title = seo.title

    if (seo.description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
    }
    if (seo.robots) {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots })
    }
    if (seo.canonical) {
      upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: seo.canonical })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.og_title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.og_description })
    if (seo.og_image) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.og_image })
    }
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.og_type || 'website' })
    if (seo.og_locale) {
      upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: seo.og_locale })
    }
    if (seo.canonical) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical })
    }

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: seo.twitter_card || 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.twitter_title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.twitter_description })
    if (seo.twitter_image) {
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.twitter_image })
    }

    const phone = contact.cards.find((card) => /телефон|phone/i.test(card.label) && card.value.trim())
    const email = contact.cards.find((card) => /email|пошта/i.test(card.label) && card.value.trim())
    const address = contact.cards.find((card) => /адрес/i.test(card.label) && card.value.trim())
    const brand = `${header.brand_primary} ${header.brand_accent}`.trim()

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: brand || 'AS clean',
      description: seo.description,
      areaServed: 'Дніпро',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Дніпро',
        addressCountry: 'UA',
        streetAddress: address?.value || 'Дніпро',
      },
    }
    if (phone?.value) jsonLd.telephone = phone.value
    if (email?.value) jsonLd.email = email.value
    if (seo.og_image) jsonLd.image = seo.og_image
    if (seo.canonical) jsonLd.url = seo.canonical
    upsertJsonLd('ld-local-business', jsonLd)
  }, [seo, contact, header])

  return null
}
