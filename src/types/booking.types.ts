export interface BookingResponse<T> {
  success: boolean
  data?: T
  message: string
  error?: string
  code?: string
}

export interface CommissionInfo {
  willBeCharged: boolean
  rate?: number
  amount?: number
  reason: string
  businessPayout: number
}

export interface ClientReliabilityInfo {
  score: number
  requiresDeposit: boolean
  reason: string
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
  
  // NEW FIELDS for enhanced booking
  requiresDeposit?: boolean
  depositAmount?: number
  depositReason?: string
  remainingAmount?: number
  commissionInfo?: CommissionInfo
  clientReliability?: ClientReliabilityInfo
}

export interface StaffAssignment {
  staffId: string
  serviceId: string
  staffName?: string
  assignedAt: Date
  status: 'assigned' | 'pending' | 'failed' | 'confirmed'
  email?: string
  phone?: string
  error?: string
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
  assignments?: StaffAssignment[]
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
  remainingAmount?: number
  commissionInfo?: CommissionInfo
}
