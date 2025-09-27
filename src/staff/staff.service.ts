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
    private staffModel: Model<StaffDocument>,
    @InjectModel(StaffSchedule.name)
    private staffScheduleModel: Model<StaffScheduleDocument>,
    @InjectModel(StaffAssignment.name)
    private staffAssignmentModel: Model<StaffAssignmentDocument>,
    @InjectModel(WorkingHours.name)
    private workingHoursModel: Model<WorkingHoursDocument>,
  ) {}


  // ================== STAFF MANAGEMENT ==================
  async createStaff(createStaffDto: CreateStaffDto): Promise<StaffDocument> {
    const staffId = await this.generateStaffId(createStaffDto.businessId)

    const staff = new this.staffModel({
      ...createStaffDto,
      staffId,
      userId: new Types.ObjectId(createStaffDto.userId),
      businessId: new Types.ObjectId(createStaffDto.businessId),
    })

    const savedStaff = await staff.save()

    // Create default weekly schedule
    await this.createDefaultSchedule(savedStaff._id.toString(), createStaffDto.businessId)

    return savedStaff
  }

  async getStaffById(staffId: string): Promise<StaffDocument> {
    const staff = await this.staffModel
      .findById(staffId)
      .populate('userId', 'firstName lastName email')
      .exec()

    if (!staff) {
      throw new NotFoundException('Staff member not found')
    }

    return staff
  }

  async updateStaffStatus(staffId: string, status: string, reason?: string): Promise<StaffDocument> {
    const validStatuses = ['active', 'inactive', 'on_leave', 'terminated']
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status provided')
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // If terminating, set termination date
    if (status === 'terminated') {
      updateData.terminationDate = new Date()
    }

    // If reason is provided, you might want to log it somewhere
    if (reason) {
      // You could create a status change log here
      // For now, we'll just include it in notes or create a separate logging mechanism
    }

    const staff = await this.staffModel.findByIdAndUpdate(
      staffId,
      updateData,
      { new: true }
    )

    if (!staff) {
      throw new NotFoundException('Staff member not found')
    }

    return staff
  }

  async updateStaffSkills(staffId: string, skills: StaffSkills[]): Promise<StaffDocument> {
    const staff = await this.staffModel.findByIdAndUpdate(
      staffId,
      { skills, updatedAt: new Date() },
      { new: true }
    )

    if (!staff) {
      throw new NotFoundException('Staff member not found')
    }

    return staff
  }

  async getStaffByBusiness(businessId: string, status?: string): Promise<StaffDocument[]> {
    const query: any = { businessId: new Types.ObjectId(businessId) }
    
    if (status) {
      query.status = status
    }

    return await this.staffModel
      .find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ firstName: 1 })
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

    const staff = await this.staffModel.find(staffQuery)

    const availableStaff: StaffDocument[] = []

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
    })

    return await schedule.save()
  }

  async getStaffSchedule(staffId: string, date: Date): Promise<StaffScheduleDocument | null> {
    return await this.staffScheduleModel.findOne({
      staffId: new Types.ObjectId(staffId),
      effectiveDate: { $lte: date },
      $or: [
        { endDate: null },
        { endDate: { $gte: date } }
      ],
      isActive: true
    })
  }

  async updateStaffSchedule(scheduleId: string, updateData: Partial<StaffSchedule>): Promise<StaffScheduleDocument> {
    const schedule = await this.staffScheduleModel.findByIdAndUpdate(
      scheduleId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )

    if (!schedule) {
      throw new NotFoundException('Schedule not found')
    }

    return schedule
  }

  // ================== ASSIGNMENT MANAGEMENT ==================
  async assignStaffToAppointment(assignmentDto: AssignStaffDto): Promise<StaffAssignmentDocument> {
    // Check if staff is available for the time slot
    const isAvailable = await this.checkStaffAvailability(
      assignmentDto.staffId,
      assignmentDto.assignmentDate,
      assignmentDto.assignmentDetails.startTime,
      assignmentDto.assignmentDetails.endTime
    )

    if (!isAvailable) {
      throw new BadRequestException('Staff is not available for the requested time slot')
    }

    // Check if staff has the required skills
    const hasSkill = await this.checkStaffSkill(
      assignmentDto.staffId,
      assignmentDto.assignmentDetails.serviceId
    )

    if (!hasSkill) {
      throw new BadRequestException('Staff does not have the required skills for this service')
    }

    // Convert DTO assignment details to schema format
    const assignmentDetails: AssignmentDetails = {
      startTime: assignmentDto.assignmentDetails.startTime,
      endTime: assignmentDto.assignmentDetails.endTime,
      assignmentType: assignmentDto.assignmentDetails.assignmentType,
      estimatedDuration: assignmentDto.assignmentDetails.estimatedDuration,
      specialInstructions: assignmentDto.assignmentDetails.specialInstructions,
      serviceId: new Types.ObjectId(assignmentDto.assignmentDetails.serviceId),
      serviceName: assignmentDto.assignmentDetails.serviceName,
      roomNumber: assignmentDto.assignmentDetails.roomNumber,
      requiredEquipment: assignmentDto.assignmentDetails.requiredEquipment || [],
      clientPreferences: assignmentDto.assignmentDetails.clientPreferences,
      setupTimeMinutes: assignmentDto.assignmentDetails.setupTimeMinutes || 0,
      cleanupTimeMinutes: assignmentDto.assignmentDetails.cleanupTimeMinutes || 0
    }

    const assignment = new this.staffAssignmentModel({
      staffId: new Types.ObjectId(assignmentDto.staffId),
      businessId: new Types.ObjectId(assignmentDto.businessId),
      appointmentId: new Types.ObjectId(assignmentDto.appointmentId),
      clientId: new Types.ObjectId(assignmentDto.clientId),
      assignmentDate: assignmentDto.assignmentDate,
      assignmentDetails,
      assignedBy: new Types.ObjectId(assignmentDto.assignedBy),
      assignmentMethod: assignmentDto.assignmentMethod || 'manual'
    })

    return await assignment.save()
  }

  async autoAssignStaff(
    businessId: string,
    appointmentId: string,
    clientId: string,
    serviceId: string,
    assignmentDate: Date,
    startTime: string,
    endTime: string
  ): Promise<StaffAssignmentDocument> {
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

    // Apply assignment algorithm
    const selectedStaff = await this.selectBestStaff(availableStaff, serviceId, clientId)

    // Create assignment details for auto assignment
    const assignmentDetails: AssignmentDetails = {
      startTime,
      endTime,
      assignmentType: 'primary',
      estimatedDuration: this.calculateMinutesDifference(startTime, endTime),
      serviceId: new Types.ObjectId(serviceId),
      serviceName: 'Service Name', // TODO: Get from service model
      specialInstructions: '',
      roomNumber: '',
      requiredEquipment: [],
      clientPreferences: '',
      setupTimeMinutes: 0,
      cleanupTimeMinutes: 0
    }

    const assignment = new this.staffAssignmentModel({
      staffId: selectedStaff._id,
      businessId: new Types.ObjectId(businessId),
      appointmentId: new Types.ObjectId(appointmentId),
      clientId: new Types.ObjectId(clientId),
      assignmentDate,
      assignmentDetails,
      assignedBy: selectedStaff._id, // Auto-assigned by system
      assignmentMethod: 'auto'
    })

    return await assignment.save()
  }

  async getStaffAssignments(
    staffId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StaffAssignmentDocument[]> {
    return await this.staffAssignmentModel
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
    )

    if (!assignment) {
      throw new NotFoundException('Assignment not found')
    }

    // Update staff statistics
    await this.updateStaffStats(assignment.staffId.toString())

    return assignment
  }

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
  }

  // ================== PRIVATE HELPER METHODS ==================
  // private async recordWorkingHours(workingHoursDto: {
  //   staffId: string
  //   businessId: string
  //   date: Date
  //   scheduledHours: TimeSlot[]
  //   actualHours?: TimeSlot[]
  //   breakMinutes?: number
  //   attendanceStatus?: string
  //   notes?: string
  //   checkedInBy: string
  // }): Promise<WorkingHoursDocument> {
  //   const existingRecord = await this.workingHoursModel.findOne({
  //     staffId: new Types.ObjectId(workingHoursDto.staffId),
  //     date: new Date(workingHoursDto.date.getFullYear(), workingHoursDto.date.getMonth(), workingHoursDto.date.getDate())
  //   })

  //   const scheduledMinutes = this.calculateTotalMinutes(workingHoursDto.scheduledHours)
  //   const actualMinutes = workingHoursDto.actualHours ? 
  //     this.calculateTotalMinutes(workingHoursDto.actualHours) : 0

  //   if (existingRecord) {
  //      existingRecord.actualHours = (workingHoursDto.actualHours || [])
  //     // existingRecord.actualHours = workingHoursDto.actualHours || []
  //     existingRecord.actualMinutes = actualMinutes
  //     existingRecord.breakMinutes = workingHoursDto.breakMinutes || 0
  //     existingRecord.attendanceStatus = workingHoursDto.attendanceStatus || 'present'
  //     existingRecord.notes = workingHoursDto.notes
  //     existingRecord.updatedAt = new Date()

  //     return await existingRecord.save()
  //   }

  //   const workingHours = new this.workingHoursModel({
  //     ...workingHoursDto,
  //     staffId: new Types.ObjectId(workingHoursDto.staffId),
  //     businessId: new Types.ObjectId(workingHoursDto.businessId),
  //     scheduledMinutes,
  //     actualMinutes,
  //     checkedInBy: new Types.ObjectId(workingHoursDto.checkedInBy),
  //   })

  //   return await workingHours.save()
  // }
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
    const staff = await this.staffModel.findById(staffId)
    
    if (!staff) return false

    return staff.skills.some(skill => 
      skill.serviceId.toString() === serviceId && skill.isActive
    )
  }

  private async selectBestStaff(
    availableStaff: StaffDocument[],
    serviceId: string,
    clientId: string
  ): Promise<StaffDocument> {
    // Simple implementation: select staff with highest skill level
    const staffWithSkills = availableStaff.map(staff => {
      const skill = staff.skills.find(s => s.serviceId.toString() === serviceId)
      return {
        staff,
        skillLevel: skill ? this.getSkillLevelScore(skill.skillLevel) : 0
      }
    })

    staffWithSkills.sort((a, b) => b.skillLevel - a.skillLevel)
    
    return staffWithSkills[0].staff
  }

  private getSkillLevelScore(skillLevel: string): number {
    const scores = {
      'beginner': 1,
      'intermediate': 2,
      'expert': 3,
      'master': 4
    }
    return scores[skillLevel] || 0
  }

  private async updateStaffStats(staffId: string): Promise<void> {
    const completedAssignments = await this.staffAssignmentModel.countDocuments({
      staffId: new Types.ObjectId(staffId),
      status: 'completed'
    })

    await this.staffModel.findByIdAndUpdate(staffId, {
      completedAppointments: completedAssignments
    })
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

  private async createDefaultSchedule(
    staffId: string,
    businessId: string
  ): Promise<void> {
    const defaultSchedule: DailySchedule[] = []
    
    // Monday to Friday: 9 AM - 5 PM
    for (let day = 1; day <= 5; day++) {
      defaultSchedule.push({
        dayOfWeek: day,
        isWorkingDay: true,
        workingHours: [{
          startTime: '09:00',
          endTime: '17:00',
          isBreak: false
        }],
        breaks: [{
          startTime: '12:00',
          endTime: '13:00',
          isBreak: true,
          breakType: 'lunch'
        }],
        maxHoursPerDay: 8
      })
    }

    // Saturday: 9 AM - 2 PM
    defaultSchedule.push({
      dayOfWeek: 6,
      isWorkingDay: true,
      workingHours: [{
        startTime: '09:00',
        endTime: '14:00',
        isBreak: false
      }],
      breaks: [],
      maxHoursPerDay: 5
    })

    // Sunday: Off
    defaultSchedule.push({
      dayOfWeek: 0,
      isWorkingDay: false,
      workingHours: [],
      breaks: [],
      maxHoursPerDay: 0
    })

    await this.createStaffSchedule({
      staffId,
      businessId,
      effectiveDate: new Date(),
      weeklySchedule: defaultSchedule,
      scheduleType: 'regular',
      createdBy: staffId
    })
  }

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
}