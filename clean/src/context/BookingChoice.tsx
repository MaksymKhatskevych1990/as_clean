import { createContext, useContext, useState, type ReactNode } from 'react'

type BookingChoice = {
  propertyType: string
  cleaningType: string
}

type BookingChoiceApi = BookingChoice & {
  select: (title: string) => void
  setPropertyType: (value: string) => void
  setCleaningType: (value: string) => void
}

const empty: BookingChoice = { propertyType: '', cleaningType: '' }

const BookingChoiceContext = createContext<BookingChoiceApi>({
  ...empty,
  select: () => {},
  setPropertyType: () => {},
  setCleaningType: () => {},
})

function classify(title: string): Partial<BookingChoice> {
  const text = title.toLowerCase()
  if (/квартир/.test(text)) return { propertyType: 'Квартира' }
  if (/будин/.test(text)) return { propertyType: 'Будинок' }
  if (/офіс/.test(text)) return { propertyType: 'Офіс' }
  if (/комерц/.test(text)) return { propertyType: 'Комерційне приміщення' }
  if (/airbnb|оренд/.test(text)) return { propertyType: 'Airbnb / оренда' }
  const cleaning = title.trim()
  return cleaning ? { cleaningType: cleaning } : {}
}

export function BookingChoiceProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<BookingChoice>(empty)

  const select = (title: string) => {
    const next = classify(title)
    setChoice((prev) => ({
      propertyType: next.propertyType ?? prev.propertyType,
      cleaningType: next.cleaningType ?? prev.cleaningType,
    }))
  }

  return (
    <BookingChoiceContext.Provider
      value={{
        ...choice,
        select,
        setPropertyType: (propertyType) => setChoice((prev) => ({ ...prev, propertyType })),
        setCleaningType: (cleaningType) => setChoice((prev) => ({ ...prev, cleaningType })),
      }}
    >
      {children}
    </BookingChoiceContext.Provider>
  )
}

export function useBookingChoice() {
  return useContext(BookingChoiceContext)
}
