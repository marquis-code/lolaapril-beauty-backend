export interface BookingResponse<T> {
  success: boolean
  data?: T
  message: string
  error?: string
  code?: string
}

export interface BookingResult {
  bookingId: string
  bookingNumber: string
  estimatedTotal: number
  expiresAt: Date
  status: string
  clientId: string
  businessId: string
  booking: any
  availableSlots?: any[]
  message: string
  requiresPayment?: boolean
}

export interface AppointmentResult {
  appointmentId: string
  appointmentNumber: string
  scheduledDate: Date
  scheduledTime: string
  status: string
  clientId: string
  businessId: string
  booking: any
  message: string
  appointment: any
  assignment: any
}

export interface PaymentResult {
  paymentId: string
  success: boolean
  message: string
  transactionReference: string
  amount: number
  method: string
  gateway: string
  status: string
  payment: any
  appointment: any
}

// Additional types for completeness
export interface BookingDetails {
  bookingId: string
  bookingNumber: string
  clientId: string
  businessId: string
  services: ServiceDetail[]
  preferredDate: Date
  preferredStartTime: string
  estimatedEndTime: string
  totalDuration: number
  estimatedTotal: number
  status: BookingStatus
  createdAt: Date
  expiresAt: Date
  specialRequests?: string
}

export interface ServiceDetail {
  serviceId: string
  serviceName: string
  duration: number
  price: number
  preferredStaffId?: string
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed' 
  | 'cancelled'
  | 'expired'
  | 'payment_failed'
  | 'slot_unavailable'
  | 'completed'

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled'