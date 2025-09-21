export interface Currency {
  currency: string
  amount: number
}

export interface Duration {
  value: number
  unit: "min" | "h" | "day"
}

export interface Phone {
  countryCode: string
  number: string
}

export interface Address {
  addressName?: string
  addressType?: string
  street: string
  aptSuite?: string
  district?: string
  city: string
  region: string
  postcode: string
  country: string
}

export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
