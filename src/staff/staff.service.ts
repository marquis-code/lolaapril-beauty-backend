// src/modules/staff/services/staff.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// Import schemas
import { Staff, StaffDocument, StaffSkills } from '../staff/schemas/staff.schema'
import { StaffSchedule, StaffScheduleDocument, DailySchedule, TimeSlot, TimeSlot as ScheduleTimeSlot } from '../staff/schemas/staff-schedule.schema'
import { StaffAssignment, StaffAssignmentDocument, AssignmentDetails } from '../staff/schemas/staff-assignment.schema'
import { WorkingHours, TimeSlot as WorkingTimeSlot, WorkingHoursDocument } from '../staff/schemas/working-hours.schema'

// Import DTOs
import { CreateStaffDto } from './dto/create-staff.dto'
import { CreateStaffScheduleDto } from './dto/create-staff-schedule.dto'
import { AssignStaffDto } from './dto/assign-staff.dto'
import { CheckInStaffDto } from './dto/check-in-staff.dto'
import { CompleteAssignmentDto } from './dto/complete-assignment.dto'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name)
    private staffModel: any,
    @InjectModel(StaffSchedule.name)
   private staffScheduleModel: any,
    @InjectModel(StaffAssignment.name)
   private staffAssignmentModel: any,
    @InjectModel(WorkingHours.name)
   private workingHoursModel: any,
  ) {}


  // ================== STAFF MANAGEMENT ==================
  async createStaff(createStaffDto: CreateStaffDto): Promise<StaffDocument> {
    const staffId = await this.generateStaffId(createStaffDto.businessId)

    const staff = new this.staffModel({
      ...createStaffDto,
      staffId,
      userId: new Types.ObjectId(createStaffDto.userId),
      businessId: new Types.ObjectId(createStaffDto.businessId),
    }) as any

    const savedStaff = await staff.save() as any

    // Create default weekly schedule
    await this.createDefaultSchedule(savedStaff._id.toString(), createStaffDto.businessId) as any

    return savedStaff
  }

  async getStaffById(staffId: string): Promise<StaffDocument> {
    const staff = await this.staffModel
      .findById(staffId)
      .populate('userId', 'firstName lastName email')
      .exec() as any

    if (!staff) {
      throw new NotFoundException('Staff member not found')
    }

    return staff
  }

async updateStaffStatus(staffId: string, status: string, reason?: string): Promise<any> {
  const validStatuses = ['active', 'inactive', 'on_leave', 'terminated']
  
  if (!validStatuses.includes(status)) {
    throw new BadRequestException('Invalid status provided')
  }

  const updateData: any = {
    status,
    updatedAt: new Date()
  }

  if (status === 'terminated') {
    updateData.terminationDate = new Date()
  }

  // Use raw MongoDB operations to bypass Mongoose type complexity
  const result = await (this.staffModel as any).findByIdAndUpdate(
    staffId,
    updateData,
    { new: true }
  ).exec()

  if (!result) {
    throw new NotFoundException('Staff member not found')
  }

  return result
}

async updateStaffSkills(staffId: string, skills: StaffSkills[]): Promise<any> {
  // Use raw MongoDB operations to bypass Mongoose type complexity  
  const result = await (this.staffModel as any).findByIdAndUpdate(
    staffId,
    { skills, updatedAt: new Date() },
    { new: true }
  ).exec()

  if (!result) {
    throw new NotFoundException('Staff member not found')
  }

  return result
}

async getStaffByBusiness(businessId: string, status?: string): Promise<any> {
  const query: any = { businessId: new Types.ObjectId(businessId) }
  
  if (status) {
    query.status = status
  }

  const staff = await this.staffModel
    .find(query)
    .populate('userId', 'firstName lastName email')
    .sort({ firstName: 1 })
    .exec()

  // @ts-ignore
  return staff
}

  async getAvailableStaff(
    businessId: string,
    date: Date,
    startTime: string,
    endTime: string,
    serviceId?: string
  ): Promise<StaffDocument[]> {
    let staffQuery: any = {
      businessId: new Types.ObjectId(businessId),
      status: 'active'
    }

    // Filter by service skill if provided
    if (serviceId) {
      staffQuery['skills.serviceId'] = new Types.ObjectId(serviceId)
      staffQuery['skills.isActive'] = true
    }

    const staff = await this.staffModel.find(staffQuery) as any

    const availableStaff: StaffDocument[] = [] as any

    for (const member of staff) {
      const isAvailable = await this.checkStaffAvailability(
        member._id.toString(),
        date,
        startTime,
        endTime
      )

      if (isAvailable) {
        availableStaff.push(member)
      }
    }

    return availableStaff
  }

  // ================== SCHEDULE MANAGEMENT ==================
  async createStaffSchedule(createScheduleDto: CreateStaffScheduleDto): Promise<StaffScheduleDocument> {
    // Deactivate existing schedules that overlap
    await this.deactivateOverlappingSchedules(
      createScheduleDto.staffId,
      createScheduleDto.effectiveDate,
      createScheduleDto.endDate
    )

    const schedule = new this.staffScheduleModel({
      ...createScheduleDto,
      staffId: new Types.ObjectId(createScheduleDto.staffId),
      businessId: new Types.ObjectId(createScheduleDto.businessId),
      createdBy: new Types.ObjectId(createScheduleDto.createdBy),
    }) as any

    return await schedule.save()
  }

  // async getStaffSchedule(staffId: string, date: Date): Promise<StaffScheduleDocument | null> {
  //   return await this.staffScheduleModel.findOne({
  //     staffId: new Types.ObjectId(staffId),
  //     effectiveDate: { $lte: date },
  //     $or: [
  //       { endDate: null },
  //       { endDate: { $gte: date } }
  //     ],
  //     isActive: true
  //   })
  // }

  async getStaffSchedule(staffId: string, date: Date): Promise<StaffScheduleDocument | null> {
  const schedule = await this.staffScheduleModel.findOne({
    staffId: new Types.ObjectId(staffId),
    effectiveDate: { $lte: date },
    $or: [
      { endDate: null },
      { endDate: { $gte: date } }
    ],
    isActive: true
  }).exec() as any // Add .exec()

  return schedule as StaffScheduleDocument | null // Explicit cast
}


  async updateStaffSchedule(scheduleId: string, updateData: Partial<StaffSchedule>): Promise<StaffScheduleDocument> {
  const schedule = await this.staffScheduleModel.findByIdAndUpdate(
    scheduleId,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  ).exec() as any // Add .exec()

  if (!schedule) {
    throw new NotFoundException('Schedule not found')
  }

  return schedule as StaffScheduleDocument // Explicit cast after null check
}

async getStaffAssignments(
  staffId: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const result = await (this.staffAssignmentModel as any)
    .find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('appointmentId')
    .populate('clientId', 'firstName lastName email phone')
    .sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 })
    .exec()

  return result
}

async completeStaffAssignment(
  assignmentId: string,
  completionData: CompleteAssignmentDto
): Promise<StaffAssignmentDocument> {
  const assignment = await this.staffAssignmentModel.findByIdAndUpdate(
    assignmentId,
    {
      ...completionData,
      status: 'completed',
      updatedAt: new Date()
    },
    { new: true }
  ).exec() // Add .exec()

  if (!assignment) {
    throw new NotFoundException('Assignment not found')
  }

  // Update staff statistics
  await this.updateStaffStats(assignment.staffId.toString())

  return assignment as StaffAssignmentDocument // Explicit cast after null check
}

  // async completeStaffAssignment(
  //   assignmentId: string,
  //   completionData: CompleteAssignmentDto
  // ): Promise<StaffAssignmentDocument> {
  //   const assignment = await this.staffAssignmentModel.findByIdAndUpdate(
  //     assignmentId,
  //     {
  //       ...completionData,
  //       status: 'completed',
  //       updatedAt: new Date()
  //     },
  //     { new: true }
  //   )

  //   if (!assignment) {
  //     throw new NotFoundException('Assignment not found')
  //   }

  //   // Update staff statistics
  //   await this.updateStaffStats(assignment.staffId.toString())

  //   return assignment
  // }

  // ================== WORKING HOURS TRACKING ==================
  async checkInStaff(checkInDto: CheckInStaffDto): Promise<void> {
    const { staffId, businessId, checkedInBy } = checkInDto
    const today = new Date()
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // Get scheduled hours for today
    const schedule = await this.getStaffSchedule(staffId, today)
    const daySchedule = schedule?.weeklySchedule.find(
      day => day.dayOfWeek === today.getDay()
    )

    if (!daySchedule || !daySchedule.isWorkingDay) {
      throw new BadRequestException('Staff is not scheduled to work today')
    }

    const currentTime = today.toTimeString().substr(0, 5)

    await this.recordWorkingHours({
      staffId,
      businessId,
      date: todayDate,
      scheduledHours: daySchedule.workingHours,
      actualHours: [{
        startTime: currentTime,
        endTime: '',
        isBreak: false
      }],
      attendanceStatus: 'present',
      checkedInBy
    })
  }

  async checkOutStaff(staffId: string, businessId: string, checkedOutBy: string): Promise<void> {
    const today = new Date()
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const currentTime = today.toTimeString().substr(0, 5)

    const workingHours = await this.workingHoursModel.findOne({
      staffId: new Types.ObjectId(staffId),
      date: todayDate
    })

    if (!workingHours) {
      throw new BadRequestException('Staff has not checked in today')
    }

    // Update the last time slot with end time
    if (workingHours.actualHours.length > 0) {
      const lastSlot = workingHours.actualHours[workingHours.actualHours.length - 1]
      if (!lastSlot.endTime) {
        lastSlot.endTime = currentTime
      }
    }

    workingHours.actualMinutes = this.calculateTotalMinutes(workingHours.actualHours)
    workingHours.overtimeMinutes = Math.max(0, workingHours.actualMinutes - workingHours.scheduledMinutes)
    workingHours.checkedOutBy = new Types.ObjectId(checkedOutBy)
    workingHours.updatedAt = new Date()

    await workingHours.save()
  }

  // async getStaffWorkingHours(
  //   staffId: string,
  //   startDate: Date,
  //   endDate: Date
  // ): Promise<WorkingHoursDocument[]> {
  //   return await this.workingHoursModel
  //     .find({
  //       staffId: new Types.ObjectId(staffId),
  //       date: {
  //         $gte: startDate,
  //         $lte: endDate
  //       }
  //     })
  //     .sort({ date: 1 })
  // }

  async getStaffWorkingHours(
  staffId: string,
  startDate: Date,
  endDate: Date
): Promise<WorkingHoursDocument[]> {
  return await this.workingHoursModel
    .find({
      staffId: new Types.ObjectId(staffId),
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ date: 1 })
    .exec() as WorkingHoursDocument[] // Add .exec() and explicit cast
}

private async recordWorkingHours(workingHoursDto: {
  staffId: string
  businessId: string
  date: Date
  scheduledHours: ScheduleTimeSlot[]
  actualHours?: ScheduleTimeSlot[]
  breakMinutes?: number
  attendanceStatus?: string
  notes?: string
  checkedInBy: string
}): Promise<WorkingHoursDocument> {
  // convert schedule TimeSlots to working-hours TimeSlots
  const toWorkingTimeSlot = (slot: ScheduleTimeSlot): WorkingTimeSlot => ({
    startTime: slot.startTime,
    endTime: slot.endTime,
    isBreak: slot.isBreak ?? false,
    breakType: slot.breakType ?? '',   // ensure required
  })

  const existingRecord = await this.workingHoursModel.findOne({
    staffId: new Types.ObjectId(workingHoursDto.staffId),
    date: new Date(
      workingHoursDto.date.getFullYear(),
      workingHoursDto.date.getMonth(),
      workingHoursDto.date.getDate(),
    ),
  })

  const scheduledMinutes = this.calculateTotalMinutes(workingHoursDto.scheduledHours)
  const actualMinutes = workingHoursDto.actualHours
    ? this.calculateTotalMinutes(workingHoursDto.actualHours)
    : 0

  if (existingRecord) {
    existingRecord.actualHours = (workingHoursDto.actualHours || []).map(toWorkingTimeSlot)
    existingRecord.actualMinutes = actualMinutes
    existingRecord.breakMinutes = workingHoursDto.breakMinutes || 0
    existingRecord.attendanceStatus = workingHoursDto.attendanceStatus || 'present'
    existingRecord.notes = workingHoursDto.notes
    existingRecord.updatedAt = new Date()

    return await existingRecord.save()
  }

  const workingHours = new this.workingHoursModel({
    ...workingHoursDto,
    staffId: new Types.ObjectId(workingHoursDto.staffId),
    businessId: new Types.ObjectId(workingHoursDto.businessId),
    scheduledMinutes,
    actualMinutes,
    checkedInBy: new Types.ObjectId(workingHoursDto.checkedInBy),
    // if you also want to store actualHours on create:
    actualHours: (workingHoursDto.actualHours || []).map(toWorkingTimeSlot),
  })

  return await workingHours.save()
}


  private async checkStaffAvailability(
    staffId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    // Check if staff is scheduled to work
    const schedule = await this.getStaffSchedule(staffId, date)
    if (!schedule) return false

    const dayOfWeek = date.getDay()
    const daySchedule = schedule.weeklySchedule.find(
      day => day.dayOfWeek === dayOfWeek
    )

    if (!daySchedule || !daySchedule.isWorkingDay) return false

    // Check if requested time is within working hours
    const isWithinWorkingHours = daySchedule.workingHours.some(slot => 
      slot.startTime <= startTime && slot.endTime >= endTime
    )

    if (!isWithinWorkingHours) return false

    // Check for existing assignments
    const existingAssignments = await this.staffAssignmentModel.find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    })

    // Check for conflicts
    for (const assignment of existingAssignments) {
      const assignmentStart = assignment.assignmentDetails.startTime
      const assignmentEnd = assignment.assignmentDetails.endTime

      if (this.timeOverlaps(startTime, endTime, assignmentStart, assignmentEnd)) {
        return false
      }
    }

    return true
  }

  private async checkStaffSkill(staffId: string, serviceId: string): Promise<boolean> {
    const staff = await this.staffModel.findById(staffId) as any
    
    if (!staff) return false

    return staff.skills.some(skill => 
      skill.serviceId.toString() === serviceId && skill.isActive
    )
  }

  // private async selectBestStaff(
  //   availableStaff: StaffDocument[],
  //   serviceId: string,
  //   clientId: string
  // ): Promise<StaffDocument> {
  //   // Simple implementation: select staff with highest skill level
  //   const staffWithSkills = availableStaff.map(staff => {
  //     const skill = staff.skills.find(s => s.serviceId.toString() === serviceId)
  //     return {
  //       staff,
  //       skillLevel: skill ? this.getSkillLevelScore(skill.skillLevel) : 0
  //     }
  //   })

  //   staffWithSkills.sort((a, b) => b.skillLevel - a.skillLevel)
    
  //   return staffWithSkills[0].staff
  // }

  private getSkillLevelScore(skillLevel: string): number {
    const scores = {
      'beginner': 1,
      'intermediate': 2,
      'expert': 3,
      'master': 4
    }
    return scores[skillLevel] || 0
  }

  // private async updateStaffStats(staffId: string): Promise<void> {
  //   const completedAssignments = await this.staffAssignmentModel.countDocuments({
  //     staffId: new Types.ObjectId(staffId),
  //     status: 'completed'
  //   })

  //   await this.staffModel.findByIdAndUpdate(staffId, {
  //     completedAppointments: completedAssignments
  //   })
  // }

  private async updateStaffStats(staffId: string): Promise<void> {
  const completedAssignments = await this.staffAssignmentModel.countDocuments({
    staffId: new Types.ObjectId(staffId),
    status: 'completed'
  }).exec() // Add .exec()

  await this.staffModel.findByIdAndUpdate(staffId, {
    completedAppointments: completedAssignments
  }).exec() // Add .exec()
}

  private timeOverlaps(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return !(end1 <= start2 || start1 >= end2)
  }

  private calculateMinutesDifference(startTime: string, endTime: string): number {
    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)
    return end - start
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private calculateTotalMinutes(timeSlots: TimeSlot[]): number {
    return timeSlots.reduce((total, slot) => {
      if (!slot.endTime || slot.isBreak) return total
      return total + this.calculateMinutesDifference(slot.startTime, slot.endTime)
    }, 0)
  }

  private async generateStaffId(businessId: string): Promise<string> {
    const count = await this.staffModel.countDocuments({
      businessId: new Types.ObjectId(businessId)
    })
    
    return `STF${String(count + 1).padStart(4, '0')}`
  }

  // private async createDefaultSchedule(
  //   staffId: string,
  //   businessId: string
  // ): Promise<void> {
  //   const defaultSchedule: DailySchedule[] = []
    
  //   // Monday to Friday: 9 AM - 5 PM
  //   for (let day = 1; day <= 5; day++) {
  //     defaultSchedule.push({
  //       dayOfWeek: day,
  //       isWorkingDay: true,
  //       workingHours: [{
  //         startTime: '09:00',
  //         endTime: '17:00',
  //         isBreak: false
  //       }],
  //       breaks: [{
  //         startTime: '12:00',
  //         endTime: '13:00',
  //         isBreak: true,
  //         breakType: 'lunch'
  //       }],
  //       maxHoursPerDay: 8
  //     })
  //   }

  //   // Saturday: 9 AM - 2 PM
  //   defaultSchedule.push({
  //     dayOfWeek: 6,
  //     isWorkingDay: true,
  //     workingHours: [{
  //       startTime: '09:00',
  //       endTime: '14:00',
  //       isBreak: false
  //     }],
  //     breaks: [],
  //     maxHoursPerDay: 5
  //   })

  //   // Sunday: Off
  //   defaultSchedule.push({
  //     dayOfWeek: 0,
  //     isWorkingDay: false,
  //     workingHours: [],
  //     breaks: [],
  //     maxHoursPerDay: 0
  //   })

  //   await this.createStaffSchedule({
  //     staffId,
  //     businessId,
  //     effectiveDate: new Date(),
  //     weeklySchedule: defaultSchedule,
  //     scheduleType: 'regular',
  //     createdBy: staffId
  //   })
  // }

  private async deactivateOverlappingSchedules(
    staffId: string,
    effectiveDate: Date,
    endDate?: Date
  ): Promise<void> {
    const query: any = {
      staffId: new Types.ObjectId(staffId),
      isActive: true,
      effectiveDate: { $lte: endDate || new Date('2099-12-31') }
    }

    if (endDate) {
      query.$or = [
        { endDate: null },
        { endDate: { $gte: effectiveDate } }
      ]
    }

    await this.staffScheduleModel.updateMany(query, {
      isActive: false,
      updatedAt: new Date()
    })
  }

//Aded again
//Added here
// Add these new methods to your StaffService class

/**
 * Simplified staff assignment for booking orchestrator
 * This is a lightweight version that returns assignment info without full validation
 */
async assignStaffToAppointment(assignmentDto: AssignStaffDto): Promise<{
  staffId: string
  serviceId: string
  staffName?: string
  email?: string
  phone?: string
  status: string
  assignedAt: Date
}> {
  try {
    const { businessId, appointmentId, staffId, assignmentDate, assignmentDetails } = assignmentDto
    const { serviceId, startTime, endTime, estimatedDuration } = assignmentDetails

    // If endTime is not provided, calculate it from duration
    const calculatedEndTime = endTime || this.addMinutesToTime(startTime, estimatedDuration)

    // Check if staff is available (optional - can be made strict or lenient)
    const isAvailable = await this.checkStaffAvailability(
      staffId,
      assignmentDate,
      startTime,
      calculatedEndTime
    )

    if (!isAvailable) {
      throw new BadRequestException('Staff is not available for the requested time slot')
    }

    // Get staff details
    const staff = await this.staffModel.findById(staffId).exec()
    
    if (!staff) {
      throw new NotFoundException('Staff member not found')
    }

    // Create assignment details
    const fullAssignmentDetails: AssignmentDetails = {
      startTime,
      endTime: calculatedEndTime,
      assignmentType: assignmentDetails.assignmentType || 'primary',
      estimatedDuration: estimatedDuration,
      serviceId: new Types.ObjectId(serviceId),
      serviceName: assignmentDetails.serviceName || 'Service',
      specialInstructions: assignmentDetails.specialInstructions || '',
      roomNumber: assignmentDetails.roomNumber || '',
      requiredEquipment: assignmentDetails.requiredEquipment || [],
      clientPreferences: assignmentDetails.clientPreferences || '',
      setupTimeMinutes: assignmentDetails.setupTimeMinutes || 0,
      cleanupTimeMinutes: assignmentDetails.cleanupTimeMinutes || 0
    }

    // Create the assignment record
    const assignment = new this.staffAssignmentModel({
      staffId: new Types.ObjectId(staffId),
      businessId: new Types.ObjectId(businessId),
      appointmentId: new Types.ObjectId(appointmentId),
      clientId: assignmentDto.clientId ? new Types.ObjectId(assignmentDto.clientId) : undefined,
      assignmentDate,
      assignmentDetails: fullAssignmentDetails,
      assignedBy: assignmentDto.assignedBy ? new Types.ObjectId(assignmentDto.assignedBy) : undefined,
      assignmentMethod: assignmentDto.assignmentMethod || 'manual'
    })

    await assignment.save()

    // Return assignment info
    return {
      staffId: staff._id.toString(),
      serviceId: serviceId,
      staffName: `${staff.firstName} ${staff.lastName}`,
      email: staff.email,
      phone: staff.phone,
      status: 'assigned',
      assignedAt: new Date()
    }
  } catch (error) {
    console.error(`Failed to assign staff ${assignmentDto.staffId}:`, error.message)
    throw error
  }
}

/**
 * Helper method to add minutes to a time string
 */
private addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}

/**
 * Enhanced auto-assign that returns detailed assignment info
 */
// async autoAssignStaff(
//   businessId: string,
//   appointmentId: string,
//   clientId: string,
//   serviceId: string,
//   assignmentDate: Date,
//   startTime: string,
//   endTime: string
// ): Promise<{
//   staffId: string
//   serviceId: string
//   staffName?: string
//   email?: string
//   phone?: string
//   status: string
//   assignedAt: Date
// }> {
//   try {
//     // Get available staff for the service and time slot
//     const availableStaff = await this.getAvailableStaff(
//       businessId,
//       assignmentDate,
//       startTime,
//       endTime,
//       serviceId
//     )

//     if (availableStaff.length === 0) {
//       throw new BadRequestException('No staff available for the requested time slot')
//     }

//     // Apply assignment algorithm
//     const selectedStaff = await this.selectBestStaff(availableStaff, serviceId, clientId)

//     // Calculate duration
//     const duration = this.calculateMinutesDifference(startTime, endTime)

//     // Create assignment details
//     const assignmentDetails: AssignmentDetails = {
//       startTime,
//       endTime,
//       assignmentType: 'primary',
//       estimatedDuration: duration,
//       serviceId: new Types.ObjectId(serviceId),
//       serviceName: 'Service', // Will be populated by orchestrator
//       specialInstructions: '',
//       roomNumber: '',
//       requiredEquipment: [],
//       clientPreferences: '',
//       setupTimeMinutes: 0,
//       cleanupTimeMinutes: 0
//     }

//     // Create the assignment
//     const assignment = new this.staffAssignmentModel({
//       staffId: selectedStaff._id,
//       businessId: new Types.ObjectId(businessId),
//       appointmentId: new Types.ObjectId(appointmentId),
//       clientId: new Types.ObjectId(clientId),
//       assignmentDate,
//       assignmentDetails,
//       assignedBy: selectedStaff._id,
//       assignmentMethod: 'auto'
//     })

//     await assignment.save()

//     // Return detailed assignment info
//     return {
//       staffId: selectedStaff._id.toString(),
//       serviceId: serviceId,
//       staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
//       email: selectedStaff.email,
//       phone: selectedStaff.phone,
//       status: 'assigned',
//       assignedAt: new Date()
//     }
//   } catch (error) {
//     console.error('Auto-assignment failed:', error.message)
//     throw error
//   }
// }

/**
 * Get multiple staff assignments by appointment ID
 * Useful for retrieving all staff assigned to an appointment
 */
async getAssignmentsByAppointment(appointmentId: string): Promise<any[]> {
  try {
    const assignments = await this.staffAssignmentModel
      .find({ appointmentId: new Types.ObjectId(appointmentId) })
      .populate('staffId', 'firstName lastName email phone')
      .populate('clientId', 'firstName lastName email phone')
      .exec()

    return assignments.map(assignment => ({
      assignmentId: assignment._id.toString(),
      staffId: assignment.staffId._id.toString(),
      staffName: `${assignment.staffId.firstName} ${assignment.staffId.lastName}`,
      serviceId: assignment.assignmentDetails.serviceId.toString(),
      serviceName: assignment.assignmentDetails.serviceName,
      startTime: assignment.assignmentDetails.startTime,
      endTime: assignment.assignmentDetails.endTime,
      status: assignment.status,
      assignedAt: assignment.createdAt
    }))
  } catch (error) {
    console.error('Failed to get assignments:', error.message)
    return []
  }
}

/**
 * Update assignment status (for check-in, completion, etc.)
 */
async updateAssignmentStatus(
  assignmentId: string,
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
): Promise<void> {
  try {
    await this.staffAssignmentModel.findByIdAndUpdate(
      assignmentId,
      { 
        status, 
        updatedAt: new Date() 
      },
      { new: true }
    ).exec()
  } catch (error) {
    console.error('Failed to update assignment status:', error.message)
    throw error
  }
}

/**
 * Cancel a staff assignment
 */
async cancelStaffAssignment(
  assignmentId: string,
  reason?: string
): Promise<void> {
  try {
    await this.staffAssignmentModel.findByIdAndUpdate(
      assignmentId,
      { 
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date() 
      },
      { new: true }
    ).exec()
  } catch (error) {
    console.error('Failed to cancel assignment:', error.message)
    throw error
  }
}

/**
 * Reassign a service to a different staff member
 */
async reassignStaff(
  assignmentId: string,
  newStaffId: string,
  reason?: string
): Promise<{
  staffId: string
  serviceId: string
  staffName?: string
  status: string
  assignedAt: Date
}> {
  try {
    // Get the existing assignment
    const oldAssignment = await this.staffAssignmentModel.findById(assignmentId).exec()
    
    if (!oldAssignment) {
      throw new NotFoundException('Assignment not found')
    }

    // Check if new staff is available
    const isAvailable = await this.checkStaffAvailability(
      newStaffId,
      oldAssignment.assignmentDate,
      oldAssignment.assignmentDetails.startTime,
      oldAssignment.assignmentDetails.endTime
    )

    if (!isAvailable) {
      throw new BadRequestException('New staff is not available for this time slot')
    }

    // Get new staff details
    const newStaff = await this.staffModel.findById(newStaffId).exec()
    
    if (!newStaff) {
      throw new NotFoundException('New staff member not found')
    }

    // Cancel old assignment
    oldAssignment.status = 'cancelled'
    oldAssignment.cancellationReason = reason || 'Reassigned to different staff'
    await oldAssignment.save()

    // Create new assignment
    const newAssignment = new this.staffAssignmentModel({
      staffId: new Types.ObjectId(newStaffId),
      businessId: oldAssignment.businessId,
      appointmentId: oldAssignment.appointmentId,
      clientId: oldAssignment.clientId,
      assignmentDate: oldAssignment.assignmentDate,
      assignmentDetails: oldAssignment.assignmentDetails,
      assignmentMethod: 'manual',
      notes: `Reassigned from staff ${oldAssignment.staffId}. Reason: ${reason}`
    })

    await newAssignment.save()

    return {
      staffId: newStaff._id.toString(),
      serviceId: oldAssignment.assignmentDetails.serviceId.toString(),
      staffName: `${newStaff.firstName} ${newStaff.lastName}`,
      status: 'assigned',
      assignedAt: new Date()
    }
  } catch (error) {
    console.error('Failed to reassign staff:', error.message)
    throw error
  }
}

// ============================================================================
// 2. UPDATE: StaffService - Add default 24/7 schedule creation
// ============================================================================
// Add this method to StaffService:

// private async createDefaultSchedule(
//   staffId: string,
//   businessId: string
// ): Promise<void> {
//   // Default 24/7 availability schedule
//   const default24_7Schedule: DailySchedule[] = []
  
//   // All days available 24/7 (12:00 AM to 11:59 PM)
//   for (let day = 0; day <= 6; day++) {
//     default24_7Schedule.push({
//       dayOfWeek: day,
//       isWorkingDay: true,
//       workingHours: [{
//         startTime: '00:00',
//         endTime: '23:59',
//         isBreak: false
//       }],
//       breaks: [],
//       maxHoursPerDay: 24
//     })
//   }

//   await this.createStaffSchedule({
//     staffId,
//     businessId,
//     effectiveDate: new Date(),
//     weeklySchedule: default24_7Schedule,
//     scheduleType: '24_7',
//     reason: 'Default 24/7 availability',
//     createdBy: staffId,
//     isDefault24_7: true // Mark as default
//   })
// }

//Newly Added
// src/modules/staff/services/staff.service.ts - Key Updates

// UPDATE: createDefaultSchedule method to create TRUE 24/7 availability
private async createDefaultSchedule(
  staffId: string,
  businessId: string
): Promise<void> {
  const default24_7Schedule: DailySchedule[] = []
  
  // Create 24/7 availability for ALL days (0-6)
  for (let day = 0; day <= 6; day++) {
    default24_7Schedule.push({
      dayOfWeek: day,
      isWorkingDay: true,
      workingHours: [{
        startTime: '00:00',
        endTime: '23:59',
        isBreak: false
      }],
      breaks: [], // No breaks in default 24/7 schedule
      maxHoursPerDay: 24
    })
  }

  await this.createStaffSchedule({
    staffId,
    businessId,
    effectiveDate: new Date(),
    endDate: undefined, // No end date for default schedule
    weeklySchedule: default24_7Schedule,
    scheduleType: '24_7',
    reason: 'Default 24/7 staff availability',
    createdBy: staffId,
    isDefault24_7: true // Mark as default 24/7 schedule
  })
}

// UPDATE: Enhanced auto-assignment with better staff selection logic
async autoAssignStaff(
  businessId: string,
  appointmentId: string,
  clientId: string,
  serviceId: string,
  assignmentDate: Date,
  startTime: string,
  endTime: string
): Promise<{
  staffId: string
  serviceId: string
  staffName?: string
  email?: string
  phone?: string
  status: string
  assignedAt: Date
}> {
  try {
    // Get available staff for the service and time slot
    const availableStaff = await this.getAvailableStaff(
      businessId,
      assignmentDate,
      startTime,
      endTime,
      serviceId
    )

    if (availableStaff.length === 0) {
      throw new BadRequestException('No staff available for the requested time slot')
    }

    // Apply intelligent selection algorithm
    const selectedStaff = await this.selectBestStaff(
      availableStaff, 
      serviceId, 
      clientId
    )

    // Calculate duration
    const duration = this.calculateMinutesDifference(startTime, endTime)

    // Create assignment
    const assignment = new this.staffAssignmentModel({
      staffId: selectedStaff._id,
      businessId: new Types.ObjectId(businessId),
      appointmentId: new Types.ObjectId(appointmentId),
      clientId: new Types.ObjectId(clientId),
      assignmentDate,
      assignmentDetails: {
        startTime,
        endTime,
        assignmentType: 'primary',
        estimatedDuration: duration,
        serviceId: new Types.ObjectId(serviceId),
        serviceName: 'Service',
        specialInstructions: '',
        roomNumber: '',
        requiredEquipment: [],
        clientPreferences: '',
        setupTimeMinutes: 0,
        cleanupTimeMinutes: 0
      },
      assignedBy: selectedStaff._id,
      assignmentMethod: 'auto',
      status: 'scheduled'
    })

    await assignment.save()

    return {
      staffId: selectedStaff._id.toString(),
      serviceId: serviceId,
      staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
      email: selectedStaff.email,
      phone: selectedStaff.phone,
      status: 'assigned',
      assignedAt: new Date()
    }
  } catch (error) {
    console.error('Auto-assignment failed:', error.message)
    throw error
  }
}

// ENHANCED: Better staff selection algorithm
private async selectBestStaff(
  availableStaff: StaffDocument[],
  serviceId: string,
  clientId: string
): Promise<StaffDocument> {
  // Score each staff member based on multiple criteria
  const staffScores = await Promise.all(
    availableStaff.map(async (staff) => {
      let score = 0
      
      // 1. Skill level for this service (40 points max)
      const skill = staff.skills.find(s => s.serviceId.toString() === serviceId)
      if (skill) {
        const skillScores = {
          'master': 40,
          'expert': 30,
          'intermediate': 20,
          'beginner': 10
        }
        score += skillScores[skill.skillLevel] || 0
      }
      
      // 2. Staff rating (30 points max)
      if (staff.totalReviews > 0) {
        score += (staff.totalRating / staff.totalReviews) * 6 // Convert 5-star to 30 points
      }
      
      // 3. Experience with service (20 points max)
      const experienceMonths = skill?.experienceMonths || 0
      score += Math.min(experienceMonths / 6, 20) // Max 20 points at 120+ months
      
      // 4. Workload balance (10 points) - fewer current assignments = higher score
      const todayAssignments = await this.staffAssignmentModel.countDocuments({
        staffId: staff._id,
        assignmentDate: new Date(),
        status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
      }).exec()
      score += Math.max(10 - todayAssignments, 0)
      
      return { staff, score }
    })
  )
  
  // Sort by score (highest first)
  staffScores.sort((a, b) => b.score - a.score)
  
  // Return the best staff member
  return staffScores[0].staff
}

// NEW: Get staff workload for the day
async getStaffWorkload(
  staffId: string,
  date: Date
): Promise<{
  totalAssignments: number
  totalMinutes: number
  assignments: any[]
}> {
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const assignments = await this.staffAssignmentModel
    .find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: normalizedDate,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    })
    .populate('appointmentId')
    .populate('clientId', 'firstName lastName')
    .sort({ 'assignmentDetails.startTime': 1 })
    .exec()
  
  const totalMinutes = assignments.reduce((total, assignment) => {
    return total + assignment.assignmentDetails.estimatedDuration
  }, 0)
  
  return {
    totalAssignments: assignments.length,
    totalMinutes,
    assignments
  }
}

// NEW: Check if staff has overlapping assignments
private async hasOverlappingAssignments(
  staffId: string,
  date: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const overlappingAssignments = await this.staffAssignmentModel
    .find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: normalizedDate,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    })
    .exec()
  
  return overlappingAssignments.some(assignment => {
    const assignmentStart = assignment.assignmentDetails.startTime
    const assignmentEnd = assignment.assignmentDetails.endTime
    
    return this.timeOverlaps(startTime, endTime, assignmentStart, assignmentEnd)
  })
}
}