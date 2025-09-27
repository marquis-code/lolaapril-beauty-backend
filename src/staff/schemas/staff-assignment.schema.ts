// src/modules/staff/schemas/staff-assignment.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type StaffAssignmentDocument = StaffAssignment & Document

@Schema()
export class AssignmentDetails {
  @Prop({ required: true })
  startTime: string // "09:00"

  @Prop({ required: true })
  endTime: string // "17:00"

  @Prop({
    required: true,
    enum: ['primary', 'secondary', 'backup'],
    default: 'primary'
  })
  assignmentType: string

  @Prop({ default: 0 })
  estimatedDuration: number // in minutes

  @Prop()
  specialInstructions: string

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId

  @Prop({ required: true })
  serviceName: string

  @Prop()
  roomNumber: string

  @Prop({ type: [String], default: [] })
  requiredEquipment: string[]

  @Prop()
  clientPreferences: string

  @Prop({ default: 0 })
  setupTimeMinutes: number

  @Prop({ default: 0 })
  cleanupTimeMinutes: number
}

@Schema()
export class AssignmentNotes {
  @Prop({ required: true })
  note: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  addedBy: Types.ObjectId

  @Prop({ default: Date.now })
  addedAt: Date

  @Prop({
    enum: ['general', 'client_request', 'admin_note', 'completion_note'],
    default: 'general'
  })
  noteType: string
}

@Schema()
export class AssignmentHistory {
  @Prop({ required: true })
  action: string // 'assigned', 'reassigned', 'cancelled', 'completed'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy: Types.ObjectId

  @Prop({ default: Date.now })
  performedAt: Date

  @Prop()
  reason: string

  @Prop()
  previousValue: string

  @Prop()
  newValue: string
}

@Schema({ timestamps: true })
export class StaffAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ required: true })
  assignmentDate: Date

  @Prop({ type: AssignmentDetails, required: true })
  assignmentDetails: AssignmentDetails

  @Prop({
    required: true,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled'
  })
  status: string

  @Prop()
  actualStartTime: string

  @Prop()
  actualEndTime: string

  @Prop()
  completionNotes: string

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number

  @Prop()
  clientFeedback: string

  @Prop()
  staffFeedback: string

  @Prop({
    required: true,
    enum: ['auto', 'manual', 'client_request', 'admin_override'],
    default: 'auto'
  })
  assignmentMethod: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedBy: Types.ObjectId

  @Prop()
  reassignmentReason: string

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  previousStaffId: Types.ObjectId

  @Prop({ default: 0 })
  reassignmentCount: number

  @Prop({ type: [AssignmentNotes], default: [] })
  notes: AssignmentNotes[]

  @Prop({ type: [AssignmentHistory], default: [] })
  history: AssignmentHistory[]

  // Payment and Commission Related
  @Prop({ default: 0 })
  servicePrice: number

  @Prop({ default: 0 })
  commissionAmount: number

  @Prop({
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  })
  commissionType: string

  @Prop({ default: 0 })
  commissionRate: number

  @Prop({ default: false })
  commissionPaid: boolean

  @Prop()
  paymentDate: Date

  // Time Tracking
  @Prop()
  checkedInAt: Date

  @Prop()
  checkedOutAt: Date

  @Prop({ default: 0 })
  actualDurationMinutes: number

  @Prop({ default: 0 })
  overtimeMinutes: number

  @Prop({ default: 0 })
  breakTimeMinutes: number

  // Quality Assurance
  @Prop({ default: false })
  qualityCheckCompleted: boolean

  @Prop()
  qualityCheckNotes: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  qualityCheckedBy: Types.ObjectId

  @Prop()
  qualityCheckDate: Date

  // Notifications
  @Prop({ default: false })
  reminderSent: boolean

  @Prop()
  reminderSentAt: Date

  @Prop({ default: false })
  confirmationSent: boolean

  @Prop()
  confirmationSentAt: Date

  // Follow-up
  @Prop({ default: false })
  followUpRequired: boolean

  @Prop()
  followUpDate: Date

  @Prop()
  followUpNotes: string

  @Prop({ default: false })
  followUpCompleted: boolean

  // Cancellation Details
  @Prop()
  cancellationReason: string

  @Prop()
  cancellationDate: Date

  @Prop({ type: Types.ObjectId, ref: 'User' })
  cancelledBy: Types.ObjectId

  @Prop({ default: false })
  cancellationFeeApplied: boolean

  @Prop({ default: 0 })
  cancellationFeeAmount: number

  // No Show Details
  @Prop()
  noShowReportedAt: Date

  @Prop({ type: Types.ObjectId, ref: 'User' })
  noShowReportedBy: Types.ObjectId

  @Prop({ default: false })
  noShowFeeApplied: boolean

  @Prop({ default: 0 })
  noShowFeeAmount: number

  // Rescheduling
  @Prop()
  originalDate: Date

  @Prop()
  originalStartTime: string

  @Prop()
  rescheduleReason: string

  @Prop()
  rescheduledAt: Date

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rescheduledBy: Types.ObjectId

  // Metadata
  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const StaffAssignmentSchema = SchemaFactory.createForClass(StaffAssignment)

// Add comprehensive indexes for better performance
StaffAssignmentSchema.index({ staffId: 1, assignmentDate: 1 })
StaffAssignmentSchema.index({ appointmentId: 1 })
StaffAssignmentSchema.index({ businessId: 1, status: 1 })
StaffAssignmentSchema.index({ clientId: 1, assignmentDate: 1 })
StaffAssignmentSchema.index({ businessId: 1, assignmentDate: 1, status: 1 })
StaffAssignmentSchema.index({ staffId: 1, status: 1 })
StaffAssignmentSchema.index({ assignmentDate: 1, status: 1 })
StaffAssignmentSchema.index({ 'assignmentDetails.serviceId': 1 })
StaffAssignmentSchema.index({ commissionPaid: 1, paymentDate: 1 })
StaffAssignmentSchema.index({ followUpRequired: 1, followUpDate: 1 })

// Add compound indexes for common queries
StaffAssignmentSchema.index({ 
  businessId: 1, 
  staffId: 1, 
  assignmentDate: 1, 
  status: 1 
})

StaffAssignmentSchema.index({ 
  businessId: 1, 
  assignmentDate: 1, 
  'assignmentDetails.startTime': 1 
})

// Virtual for full assignment duration including setup/cleanup
StaffAssignmentSchema.virtual('totalDurationMinutes').get(function() {
  return this.assignmentDetails.estimatedDuration + 
         this.assignmentDetails.setupTimeMinutes + 
         this.assignmentDetails.cleanupTimeMinutes
})

// Virtual for assignment time range
StaffAssignmentSchema.virtual('timeRange').get(function() {
  return `${this.assignmentDetails.startTime} - ${this.assignmentDetails.endTime}`
})

// Virtual for commission calculation
StaffAssignmentSchema.virtual('calculatedCommission').get(function() {
  if (this.commissionType === 'percentage') {
    return (this.servicePrice * this.commissionRate) / 100
  }
  return this.commissionAmount
})

// Pre-save middleware to update history
StaffAssignmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.history.push({
      action: `status_changed_to_${this.status}`,
      performedAt: new Date(),
      newValue: this.status,
      performedBy: this.assignedBy || null,
      reason: 'Status updated',
      previousValue: ''
    })
  }
  
  if (this.isModified('staffId') && this.isNew === false) {
    this.reassignmentCount += 1
    this.history.push({
      action: 'reassigned',
      performedAt: new Date(),
      previousValue: this.previousStaffId?.toString() || '',
      newValue: this.staffId.toString(),
      performedBy: this.assignedBy || null,
      reason: this.reassignmentReason || 'Staff reassigned'
    })
  }
  
  this.updatedAt = new Date()
  next()
})

// Static methods
StaffAssignmentSchema.statics.findByStaffAndDateRange = function(staffId: string, startDate: Date, endDate: Date) {
  return this.find({
    staffId: new Types.ObjectId(staffId),
    assignmentDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 })
}

StaffAssignmentSchema.statics.findActiveAssignments = function(businessId: string, date?: Date) {
  const query: any = {
    businessId: new Types.ObjectId(businessId),
    status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
  }
  
  if (date) {
    query.assignmentDate = {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  }
  
  return this.find(query)
    .populate('staffId', 'firstName lastName')
    .populate('clientId', 'firstName lastName phone')
    .sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 })
}

StaffAssignmentSchema.statics.findPendingCommissions = function(businessId: string, staffId?: string) {
  const query: any = {
    businessId: new Types.ObjectId(businessId),
    status: 'completed',
    commissionPaid: false,
    commissionAmount: { $gt: 0 }
  }
  
  if (staffId) {
    query.staffId = new Types.ObjectId(staffId)
  }
  
  return this.find(query).populate('staffId', 'firstName lastName')
}

// Instance methods
StaffAssignmentSchema.methods.addNote = function(noteText: string, addedBy: string, noteType: string = 'general') {
  this.notes.push({
    note: noteText,
    addedBy: new Types.ObjectId(addedBy),
    addedAt: new Date(),
    noteType
  })
  return this.save()
}

StaffAssignmentSchema.methods.markCommissionPaid = function(paidBy: string) {
  this.commissionPaid = true
  this.paymentDate = new Date()
  this.history.push({
    action: 'commission_paid',
    performedBy: new Types.ObjectId(paidBy),
    performedAt: new Date()
  })
  return this.save()
}

StaffAssignmentSchema.methods.calculateActualDuration = function() {
  if (this.actualStartTime && this.actualEndTime) {
    const start = this.timeToMinutes(this.actualStartTime)
    const end = this.timeToMinutes(this.actualEndTime)
    this.actualDurationMinutes = end - start
    
    // Calculate overtime
    if (this.actualDurationMinutes > this.assignmentDetails.estimatedDuration) {
      this.overtimeMinutes = this.actualDurationMinutes - this.assignmentDetails.estimatedDuration
    }
  }
  return this.save()
}

StaffAssignmentSchema.methods.timeToMinutes = function(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}