export interface Currency {
  currency: string
  amount: number
}

export interface PriceRange {
  from: Currency
  to?: Currency
}
