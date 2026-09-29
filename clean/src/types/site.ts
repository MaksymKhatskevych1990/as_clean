export type SeoContent = {
  title: string
  description: string
  robots: string
  canonical: string
  og_title: string
  og_description: string
  og_image: string
  og_type: string
  og_locale: string
  twitter_card: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
}

export type SectionVisibility = {
  hero: boolean
  services: boolean
  why_us: boolean
  stats: boolean
  portfolio: boolean
  videos: boolean
  pricing: boolean
  testimonials: boolean
  faq: boolean
  booking: boolean
  contact: boolean
}

export type SiteContent = {
  seo: SeoContent
  sections: SectionVisibility
  header: {
    brand_primary: string
    brand_accent: string
    cta_text: string
    nav: { href: string; label: string }[]
  }
  floating_button: string
  footer: {
    brand_primary: string
    brand_accent: string
    tagline: string
    nav_title: string
    services_title: string
    services: string[]
    copyright_name: string
    privacy_label: string
    privacy_url: string
    terms_label: string
    terms_url: string
  }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    primary_cta_text: string
    primary_cta_href: string
    secondary_cta_text: string
    secondary_cta_href: string
    image: string
    image_alt: string
    caption: string
    badges: string[]
  }
  services: {
    title: string
    subtitle: string
    items: { title: string; description: string; image: string }[]
  }
  why_us: {
    title: string
    subtitle: string
    items: { title: string; description: string }[]
  }
  stats: { value: number; suffix: string; label: string; decimals: number }[]
  portfolio: {
    title: string
    subtitle: string
    all_category_label: string
    before_label: string
    after_label: string
    categories: string[]
    items: { title: string; category: string; before: string; after: string }[]
  }
  videos: {
    title: string
    items: { title: string; description: string; thumb: string; video: string }[]
  }
  pricing: {
    title: string
    subtitle: string
    plans: {
      name: string
      price: string
      unit: string
      description: string
      highlighted: boolean
      cta_text: string
      features: string[]
    }[]
  }
  testimonials: {
    title: string
    items: { name: string; role: string; text: string; rating: number }[]
  }
  faq: {
    title: string
    items: { question: string; answer: string }[]
  }
  booking: {
    title: string
    steps: string[]
    name_label: string
    name_placeholder: string
    phone_label: string
    phone_placeholder: string
    email_label: string
    email_placeholder: string
    address_label: string
    address_placeholder: string
    property_type_label: string
    property_type_placeholder: string
    area_label: string
    area_placeholder: string
    cleaning_type_label: string
    cleaning_type_placeholder: string
    date_label: string
    time_label: string
    time_placeholder: string
    comment_label: string
    comment_placeholder: string
    photos_label: string
    photos_hint: string
    photos_note: string
    back_text: string
    next_text: string
    submit_text: string
    success_title: string
    success_text: string
    property_types: string[]
    cleaning_types: string[]
    time_slots: string[]
  }
  contact: {
    title: string
    map_embed_url: string
    map_title: string
    cards: { label: string; value: string; href: string; tint: string }[]
    socials: { name: string; url: string }[]
  }
}
