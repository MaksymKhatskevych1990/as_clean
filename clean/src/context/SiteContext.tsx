import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchSite } from '../api/client'
import { fallbackSite } from '../data/fallback'
import type { SiteContent } from '../types/site'

const SiteContext = createContext<SiteContent>(fallbackSite)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteContent>(fallbackSite)

  useEffect(() => {
    let cancelled = false

    const load = (attempt = 0) => {
      fetchSite()
        .then((data) => {
          if (!cancelled) {
            const incoming = data as SiteContent
            setSite({
              ...fallbackSite,
              ...incoming,
              sections: { ...fallbackSite.sections, ...incoming.sections },
            })
          }
        })
        .catch(() => {
          if (cancelled) return
          if (attempt < 4) {
            window.setTimeout(() => load(attempt + 1), 350 * (attempt + 1))
            return
          }
          setSite(fallbackSite)
        })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
