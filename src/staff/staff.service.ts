import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'

import { Staff, StaffDocument } from './schemas/staff.schema'
import { StaffSchedule, StaffScheduleDocument, DailySchedule } from './schemas/staff-schedule.schema'
import { StaffAssignment, StaffAssignmentDocument, AssignmentDetails } from './schemas/staff-assignment.schema'
import { WorkingHours, WorkingHoursDocument, TimeSlot as WorkingTimeSlot } from './schemas/working-hours.schema'
import { User, UserDocument, UserRole, UserStatus } from '../auth/schemas/user.schema'
import { CreateStaffDto } from './dto/create-staff.dto'
import { CreateStaffScheduleDto } from './dto/create-staff-schedule.dto'
import { AssignStaffDto } from './dto/assign-staff.dto'
import { CheckInStaffDto } from './dto/check-in-staff.dto'
import { CompleteAssignmentDto } from './dto/complete-assignment.dto'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(StaffSchedule.name) private staffScheduleModel: Model<StaffScheduleDocument>,
    @InjectModel(StaffAssignment.name) private staffAssignmentModel: Model<StaffAssignmentDocument>,
    @InjectModel(WorkingHours.name) private workingHoursModel: Model<WorkingHoursDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createStaff(createStaffDto: CreateStaffDto): Promise<any> {
    let createdUserId: string | null = null

    try {
      const existingUser = await this.userModel.findOne({ email: createStaffDto.email.toLowerCase() }).exec()
      if (existingUser) throw new ConflictException('A user with this email already exists')

      const existingStaff = await this.staffModel.findOne({
        businessId: new Types.ObjectId(createStaffDto.businessId),
        phone: createStaffDto.phone
      }).exec()
      if (existingStaff) throw new ConflictException('A staff member with this phone number already exists in this business')

      const staffId = await this.generateStaffId(createStaffDto.businessId)
      const hashedPassword = createStaffDto.password 
        ? await bcrypt.hash(createStaffDto.password, 12)
        : await bcrypt.hash(this.generateDefaultPassword(), 12)

      const newUser = new this.userModel({
        firstName: createStaffDto.firstName,
        lastName: createStaffDto.lastName,
        email: createStaffDto.email.toLowerCase(),
        phone: createStaffDto.phone,
        password: hashedPassword,
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        authProvider: 'local',
        emailVerified: false,
        phoneVerified: false,
        profileImage: createStaffDto.profileImage || '',
        staffBusinessId: new Types.ObjectId(createStaffDto.businessId),
        preferences: {
          language: 'en',
          timezone: 'Africa/Lagos',
          currency: 'NGN',
          notifications: { email: true, sms: true, push: true }
        }
      })

      const savedUser = await newUser.save()
      createdUserId = savedUser._id.toString()

      const staff = new this.staffModel({
        userId: savedUser._id,
        businessId: new Types.ObjectId(createStaffDto.businessId),
        staffId,
        firstName: createStaffDto.firstName,
        lastName: createStaffDto.lastName,
        email: createStaffDto.email.toLowerCase(),
        phone: createStaffDto.phone,
        role: createStaffDto.role,
        employmentType: createStaffDto.employmentType || 'full_time',
        hireDate: createStaffDto.hireDate,
        status: 'active',
        skills: createStaffDto.skills || [],
        commissionStructure: createStaffDto.commissionStructure || [],
        profileImage: createStaffDto.profileImage || '',
        bio: createStaffDto.bio || '',
        certifications: createStaffDto.certifications || [],
        totalRating: 0,
        totalReviews: 0,
        completedAppointments: 0,
      })

      const savedStaff = await staff.save()
      await this.createDefaultSchedule(savedStaff._id.toString(), createStaffDto.businessId)
      return JSON.parse(JSON.stringify(savedStaff))
    } catch (error) {
      if (createdUserId) await this.userModel.findByIdAndDelete(createdUserId).exec()
      throw error
    }
  }

  private generateDefaultPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length))
    return password
  }

  async getStaffById(staffId: string): Promise<any> {
    const staffDoc = await this.staffModel.findById(staffId).exec()
    if (!staffDoc) throw new NotFoundException('Staff member not found')
    const staff = JSON.parse(JSON.stringify(staffDoc))

    const userDoc = await this.userModel.findById(staff.userId).select('firstName lastName email phone role status').exec()
    const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null
    return { ...staff, userId: user }
  }

  async updateStaffStatus(staffId: string, status: string, reason?: string): Promise<any> {
    const validStatuses = ['active', 'inactive', 'on_leave', 'terminated']
    if (!validStatuses.includes(status)) throw new BadRequestException('Invalid status provided')

    const staff = await this.staffModel.findById(staffId).exec()
    if (!staff) throw new NotFoundException('Staff member not found')

    const updateData: any = { status, updatedAt: new Date() }
    if (status === 'terminated') {
      updateData.terminationDate = new Date()
      await this.userModel.findByIdAndUpdate(staff.userId, { status: UserStatus.INACTIVE, staffBusinessId: null }).exec()
    }

    const resultDoc = await this.staffModel.findByIdAndUpdate(staffId, updateData, { new: true }).exec()
    if (!resultDoc) throw new NotFoundException('Failed to update staff')
    const result = JSON.parse(JSON.stringify(resultDoc))

    const userDoc = await this.userModel.findById(result.userId).select('firstName lastName email phone role status').exec()
    const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null
    return { ...result, userId: user }
  }

  async updateStaffSkills(staffId: string, skills: any[]): Promise<any> {
    const resultDoc = await this.staffModel.findByIdAndUpdate(staffId, { skills, updatedAt: new Date() }, { new: true }).exec()
    if (!resultDoc) throw new NotFoundException('Staff member not found')
    const result = JSON.parse(JSON.stringify(resultDoc))

    const userDoc = await this.userModel.findById(result.userId).select('firstName lastName email phone').exec()
    const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null
    return { ...result, userId: user }
  }

  async getStaffByBusiness(businessId: string, status?: string): Promise<any[]> {
    const query: any = { businessId: new Types.ObjectId(businessId) }
    if (status) query.status = status

    const staffDocs = await this.staffModel.find(query).sort({ firstName: 1 }).exec()
    const staffList = JSON.parse(JSON.stringify(staffDocs))
    
    return await Promise.all(staffList.map(async (staff: any) => {
      const userDoc = await this.userModel.findById(staff.userId).select('firstName lastName email phone role status').exec()
      const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null
      return { ...staff, userId: user }
    }))
  }

  async getAvailableStaff(businessId: string, date: Date, startTime: string, endTime: string, serviceId?: string): Promise<any[]> {
    let staffQuery: any = { businessId: new Types.ObjectId(businessId), status: 'active' }
    if (serviceId) {
      staffQuery['skills.serviceId'] = new Types.ObjectId(serviceId)
      staffQuery['skills.isActive'] = true
    }

    const staffDocs = await this.staffModel.find(staffQuery).exec()
    const staff = JSON.parse(JSON.stringify(staffDocs))
    const availableStaff: any[] = []

    for (const member of staff) {
      const isAvailable = await this.checkStaffAvailability(member._id.toString(), date, startTime, endTime)
      if (isAvailable) {
        const userDoc = await this.userModel.findById(member.userId).select('firstName lastName email phone').exec()
        const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null
        availableStaff.push({ ...member, userId: user })
      }
    }
    return availableStaff
  }

  async createStaffSchedule(createScheduleDto: CreateStaffScheduleDto): Promise<any> {
    await this.deactivateOverlappingSchedules(createScheduleDto.staffId, createScheduleDto.effectiveDate, createScheduleDto.endDate)
    const schedule = new this.staffScheduleModel({
      ...createScheduleDto,
      staffId: new Types.ObjectId(createScheduleDto.staffId),
      businessId: new Types.ObjectId(createScheduleDto.businessId),
      createdBy: new Types.ObjectId(createScheduleDto.createdBy),
    })
    const saved = await schedule.save()
    return JSON.parse(JSON.stringify(saved))
  }

  async getStaffSchedule(staffId: string, date: Date): Promise<any> {
    const schedule = await this.staffScheduleModel.findOne({
      staffId: new Types.ObjectId(staffId),
      effectiveDate: { $lte: date },
      $or: [{ endDate: null }, { endDate: { $gte: date } }],
      isActive: true
    }).exec()
    return schedule ? JSON.parse(JSON.stringify(schedule)) : null
  }

  async updateStaffSchedule(scheduleId: string, updateData: Partial<StaffSchedule>): Promise<any> {
    const schedule = await this.staffScheduleModel.findByIdAndUpdate(scheduleId, { ...updateData, updatedAt: new Date() }, { new: true }).exec()
    if (!schedule) throw new NotFoundException('Schedule not found')
    return JSON.parse(JSON.stringify(schedule))
  }

  async assignStaffToAppointment(assignmentDto: AssignStaffDto): Promise<{
    staffId: string; serviceId: string; staffName?: string; email?: string; phone?: string; status: string; assignedAt: Date
  }> {
    try {
      const { businessId, appointmentId, staffId, assignmentDate, assignmentDetails } = assignmentDto
      const { serviceId, startTime, endTime, estimatedDuration } = assignmentDetails
      const calculatedEndTime = endTime || this.addMinutesToTime(startTime, estimatedDuration)

      const isAvailable = await this.checkStaffAvailability(staffId, assignmentDate, startTime, calculatedEndTime)
      if (!isAvailable) throw new BadRequestException('Staff is not available for the requested time slot')

      const staffDoc = await this.staffModel.findById(staffId).exec()
      if (!staffDoc) throw new NotFoundException('Staff member not found')
      const staff = JSON.parse(JSON.stringify(staffDoc))

      const fullAssignmentDetails: AssignmentDetails = {
        startTime,
        endTime: calculatedEndTime,
        assignmentType: assignmentDetails.assignmentType || 'primary',
        estimatedDuration,
        serviceId: new Types.ObjectId(serviceId),
        serviceName: assignmentDetails.serviceName || 'Service',
        specialInstructions: assignmentDetails.specialInstructions || '',
        roomNumber: assignmentDetails.roomNumber || '',
        requiredEquipment: assignmentDetails.requiredEquipment || [],
        clientPreferences: assignmentDetails.clientPreferences || '',
        setupTimeMinutes: assignmentDetails.setupTimeMinutes || 0,
        cleanupTimeMinutes: assignmentDetails.cleanupTimeMinutes || 0
      }

      const assignment = new this.staffAssignmentModel({
        staffId: new Types.ObjectId(staffId),
        businessId: new Types.ObjectId(businessId),
        appointmentId: new Types.ObjectId(appointmentId),
        clientId: assignmentDto.clientId ? new Types.ObjectId(assignmentDto.clientId) : undefined,
        assignmentDate,
        assignmentDetails: fullAssignmentDetails,
        assignedBy: assignmentDto.assignedBy ? new Types.ObjectId(assignmentDto.assignedBy) : undefined,
        assignmentMethod: assignmentDto.assignmentMethod || 'manual',
        status: 'scheduled'
      })

      await assignment.save()
      return {
        staffId: staff._id.toString(),
        serviceId,
        staffName: `${staff.firstName} ${staff.lastName}`,
        email: staff.email,
        phone: staff.phone,
        status: 'assigned',
        assignedAt: new Date()
      }
    } catch (error) {
      console.error(`Failed to assign staff:`, error.message)
      throw error
    }
  }

  async autoAssignStaff(businessId: string, appointmentId: string, clientId: string, serviceId: string, assignmentDate: Date, startTime: string, endTime: string): Promise<{
    staffId: string; serviceId: string; staffName?: string; email?: string; phone?: string; status: string; assignedAt: Date
  }> {
    try {
      const availableStaff = await this.getAvailableStaff(businessId, assignmentDate, startTime, endTime, serviceId)
      if (availableStaff.length === 0) throw new BadRequestException('No staff available for the requested time slot')

      const selectedStaff = await this.selectBestStaff(availableStaff, serviceId, clientId)
      const duration = this.calculateMinutesDifference(startTime, endTime)

      const assignment = new this.staffAssignmentModel({
        staffId: selectedStaff._id,
        businessId: new Types.ObjectId(businessId),
        appointmentId: new Types.ObjectId(appointmentId),
        clientId: new Types.ObjectId(clientId),
        assignmentDate,
        assignmentDetails: {
          startTime, endTime, assignmentType: 'primary', estimatedDuration: duration,
          serviceId: new Types.ObjectId(serviceId), serviceName: 'Service',
          specialInstructions: '', roomNumber: '', requiredEquipment: [],
          clientPreferences: '', setupTimeMinutes: 0, cleanupTimeMinutes: 0
        },
        assignedBy: selectedStaff._id,
        assignmentMethod: 'auto',
        status: 'scheduled'
      })

      await assignment.save()
      return {
        staffId: selectedStaff._id.toString(), serviceId,
        staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
        email: selectedStaff.email, phone: selectedStaff.phone,
        status: 'assigned', assignedAt: new Date()
      }
    } catch (error) {
      console.error('Auto-assignment failed:', error.message)
      throw error
    }
  }

  async getStaffAssignments(staffId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const assignmentDocs = await this.staffAssignmentModel.find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: { $gte: startDate, $lte: endDate }
    }).sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 }).exec()
    return JSON.parse(JSON.stringify(assignmentDocs))
  }

  async completeStaffAssignment(assignmentId: string, completionData: CompleteAssignmentDto): Promise<any> {
    const assignment = await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, {
      ...completionData, status: 'completed', updatedAt: new Date()
    }, { new: true }).exec()
    if (!assignment) throw new NotFoundException('Assignment not found')
    await this.updateStaffStats(assignment.staffId.toString())
    return JSON.parse(JSON.stringify(assignment))
  }

  async checkInStaff(checkInDto: CheckInStaffDto): Promise<void> {
    const { staffId, businessId, checkedInBy } = checkInDto
    const today = new Date()
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const schedule = await this.getStaffSchedule(staffId, today)
    const daySchedule = schedule?.weeklySchedule.find((day: any) => day.dayOfWeek === today.getDay())
    if (!daySchedule || !daySchedule.isWorkingDay) throw new BadRequestException('Staff is not scheduled to work today')

    const currentTime = today.toTimeString().substr(0, 5)
    await this.recordWorkingHours({
      staffId, businessId, date: todayDate,
      scheduledHours: daySchedule.workingHours,
      actualHours: [{ startTime: currentTime, endTime: '', isBreak: false, breakType: '' }],
      attendanceStatus: 'present', checkedInBy
    })
  }

  async checkOutStaff(staffId: string, businessId: string, checkedOutBy: string): Promise<void> {
    const today = new Date()
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const currentTime = today.toTimeString().substr(0, 5)

    const workingHours = await this.workingHoursModel.findOne({ staffId: new Types.ObjectId(staffId), date: todayDate }).exec()
    if (!workingHours) throw new BadRequestException('Staff has not checked in today')

    if (workingHours.actualHours.length > 0) {
      const lastSlot = workingHours.actualHours[workingHours.actualHours.length - 1]
      if (!lastSlot.endTime) lastSlot.endTime = currentTime
    }

    workingHours.actualMinutes = this.calculateTotalMinutes(workingHours.actualHours)
    workingHours.overtimeMinutes = Math.max(0, workingHours.actualMinutes - workingHours.scheduledMinutes)
    workingHours.checkedOutBy = new Types.ObjectId(checkedOutBy)
    workingHours.updatedAt = new Date()
    await workingHours.save()
  }

  async getStaffWorkingHours(staffId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const docs = await this.workingHoursModel.find({
      staffId: new Types.ObjectId(staffId),
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).exec()
    return JSON.parse(JSON.stringify(docs))
  }

  private async recordWorkingHours(workingHoursDto: {
    staffId: string; businessId: string; date: Date; scheduledHours: any[]; actualHours?: any[];
    breakMinutes?: number; attendanceStatus?: string; notes?: string; checkedInBy: string
  }): Promise<any> {
    const toWorkingTimeSlot = (slot: any): WorkingTimeSlot => ({
      startTime: slot.startTime, endTime: slot.endTime,
      isBreak: slot.isBreak ?? false, breakType: slot.breakType ?? ''
    })

    const existingRecord = await this.workingHoursModel.findOne({
      staffId: new Types.ObjectId(workingHoursDto.staffId),
      date: new Date(workingHoursDto.date.getFullYear(), workingHoursDto.date.getMonth(), workingHoursDto.date.getDate())
    }).exec()

    const scheduledMinutes = this.calculateTotalMinutes(workingHoursDto.scheduledHours)
    const actualMinutes = workingHoursDto.actualHours ? this.calculateTotalMinutes(workingHoursDto.actualHours) : 0

    if (existingRecord) {
      existingRecord.actualHours = (workingHoursDto.actualHours || []).map(toWorkingTimeSlot)
      existingRecord.actualMinutes = actualMinutes
      existingRecord.breakMinutes = workingHoursDto.breakMinutes || 0
      existingRecord.attendanceStatus = workingHoursDto.attendanceStatus || 'present'
      existingRecord.notes = workingHoursDto.notes
      existingRecord.updatedAt = new Date()
      const saved = await existingRecord.save()
      return JSON.parse(JSON.stringify(saved))
    }

    const workingHours = new this.workingHoursModel({
      ...workingHoursDto,
      staffId: new Types.ObjectId(workingHoursDto.staffId),
      businessId: new Types.ObjectId(workingHoursDto.businessId),
      scheduledMinutes, actualMinutes,
      checkedInBy: new Types.ObjectId(workingHoursDto.checkedInBy),
      actualHours: (workingHoursDto.actualHours || []).map(toWorkingTimeSlot)
    })
    const saved = await workingHours.save()
    return JSON.parse(JSON.stringify(saved))
  }

  private async checkStaffAvailability(staffId: string, date: Date, startTime: string, endTime: string): Promise<boolean> {
    const schedule = await this.getStaffSchedule(staffId, date)
    if (!schedule) return false

    const dayOfWeek = date.getDay()
    const daySchedule = schedule.weeklySchedule.find((day: any) => day.dayOfWeek === dayOfWeek)
    if (!daySchedule || !daySchedule.isWorkingDay) return false

    const isWithinWorkingHours = daySchedule.workingHours.some((slot: any) => slot.startTime <= startTime && slot.endTime >= endTime)
    if (!isWithinWorkingHours) return false

    const existingAssignments = await this.staffAssignmentModel.find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    }).exec()

    for (const assignment of existingAssignments) {
      if (this.timeOverlaps(startTime, endTime, assignment.assignmentDetails.startTime, assignment.assignmentDetails.endTime)) {
        return false
      }
    }
    return true
  }

  private async selectBestStaff(availableStaff: any[], serviceId: string, clientId: string): Promise<any> {
    const staffScores = await Promise.all(availableStaff.map(async (staff) => {
      let score = 0
      const skill = staff.skills.find((s: any) => s.serviceId.toString() === serviceId)
      if (skill) {
        const skillScores: any = { 'master': 40, 'expert': 30, 'intermediate': 20, 'beginner': 10 }
        score += skillScores[skill.skillLevel] || 0
      }
      if (staff.totalReviews > 0) score += (staff.totalRating / staff.totalReviews) * 6
      const experienceMonths = skill?.experienceMonths || 0
      score += Math.min(experienceMonths / 6, 20)
      const todayAssignments = await this.staffAssignmentModel.countDocuments({
        staffId: staff._id, assignmentDate: new Date(),
        status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
      }).exec()
      score += Math.max(10 - todayAssignments, 0)
      return { staff, score }
    }))
    staffScores.sort((a, b) => b.score - a.score)
    return staffScores[0].staff
  }

  private async updateStaffStats(staffId: string): Promise<void> {
    const completedAssignments = await this.staffAssignmentModel.countDocuments({
      staffId: new Types.ObjectId(staffId), status: 'completed'
    }).exec()
    await this.staffModel.findByIdAndUpdate(staffId, { completedAppointments: completedAssignments }).exec()
  }

  private timeOverlaps(start1: string, end1: string, start2: string, end2: string): boolean {
    return !(end1 <= start2 || start1 >= end2)
  }

  private calculateMinutesDifference(startTime: string, endTime: string): number {
    return this.timeToMinutes(endTime) - this.timeToMinutes(startTime)
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private calculateTotalMinutes(timeSlots: any[]): number {
    return timeSlots.reduce((total, slot) => {
      if (!slot.endTime || slot.isBreak) return total
      return total + this.calculateMinutesDifference(slot.startTime, slot.endTime)
    }, 0)
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private async generateStaffId(businessId: string): Promise<string> {
    const count = await this.staffModel.countDocuments({ businessId: new Types.ObjectId(businessId) }).exec()
    return `STF${String(count + 1).padStart(4, '0')}`
  }

  private async createDefaultSchedule(staffId: string, businessId: string): Promise<void> {
    const default24_7Schedule: DailySchedule[] = []
    for (let day = 0; day <= 6; day++) {
      default24_7Schedule.push({
        dayOfWeek: day, isWorkingDay: true,
        workingHours: [{ startTime: '00:00', endTime: '23:59', isBreak: false }],
        breaks: [], maxHoursPerDay: 24
      })
    }

    await this.createStaffSchedule({
      staffId, businessId, effectiveDate: new Date(), endDate: undefined,
      weeklySchedule: default24_7Schedule, scheduleType: '24_7',
      reason: 'Default 24/7 staff availability', createdBy: staffId, isDefault24_7: true
    })
  }

  private async deactivateOverlappingSchedules(staffId: string, effectiveDate: Date, endDate?: Date): Promise<void> {
    const query: any = {
      staffId: new Types.ObjectId(staffId), isActive: true,
      effectiveDate: { $lte: endDate || new Date('2099-12-31') }
    }
    if (endDate) query.$or = [{ endDate: null }, { endDate: { $gte: effectiveDate } }]
    await this.staffScheduleModel.updateMany(query, { isActive: false, updatedAt: new Date() }).exec()
  }

  async getAssignmentsByAppointment(appointmentId: string): Promise<any[]> {
    try {
      const assignmentDocs = await this.staffAssignmentModel.find({ appointmentId: new Types.ObjectId(appointmentId) }).exec()
      const assignments = JSON.parse(JSON.stringify(assignmentDocs))
      
      return await Promise.all(assignments.map(async (assignment: any) => {
        const staffDoc = await this.staffModel.findById(assignment.staffId).select('firstName lastName email phone').exec()
        const staff = staffDoc ? JSON.parse(JSON.stringify(staffDoc)) : null
        
        return {
          assignmentId: assignment._id.toString(),
          staffId: assignment.staffId.toString(),
          staffName: staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown',
          email: staff?.email,
          phone: staff?.phone,
          serviceId: assignment.assignmentDetails.serviceId.toString(),
          serviceName: assignment.assignmentDetails.serviceName,
          startTime: assignment.assignmentDetails.startTime,
          endTime: assignment.assignmentDetails.endTime,
          status: assignment.status,
          assignedAt: assignment.createdAt
        }
      }))
    } catch (error) {
      console.error('Failed to get assignments:', error.message)
      return []
    }
  }

  async updateAssignmentStatus(assignmentId: string, status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'): Promise<void> {
    try {
      await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, { status, updatedAt: new Date() }, { new: true }).exec()
    } catch (error) {
      throw error
    }
  }

  async cancelStaffAssignment(assignmentId: string, reason?: string): Promise<void> {
    try {
      await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, { 
        status: 'cancelled', cancellationReason: reason, updatedAt: new Date() 
      }, { new: true }).exec()
    } catch (error) {
      throw error
    }
  }

  async reassignStaff(assignmentId: string, newStaffId: string, reason?: string): Promise<{
    staffId: string; serviceId: string; staffName?: string; status: string; assignedAt: Date
  }> {
    try {
      const oldAssignment = await this.staffAssignmentModel.findById(assignmentId).exec()
      if (!oldAssignment) throw new NotFoundException('Assignment not found')

      const isAvailable = await this.checkStaffAvailability(
        newStaffId, oldAssignment.assignmentDate,
        oldAssignment.assignmentDetails.startTime,
        oldAssignment.assignmentDetails.endTime
      )
      if (!isAvailable) throw new BadRequestException('New staff is not available for this time slot')

      const newStaffDoc = await this.staffModel.findById(newStaffId).exec()
      if (!newStaffDoc) throw new NotFoundException('New staff member not found')
      const newStaff = JSON.parse(JSON.stringify(newStaffDoc))

      oldAssignment.status = 'cancelled'
      oldAssignment.cancellationReason = reason || 'Reassigned to different staff'
      await oldAssignment.save()

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

  async getStaffWorkload(staffId: string, date: Date): Promise<{
    totalAssignments: number; totalMinutes: number; assignments: any[]
  }> {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const assignmentDocs = await this.staffAssignmentModel.find({
      staffId: new Types.ObjectId(staffId),
      assignmentDate: normalizedDate,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    }).sort({ 'assignmentDetails.startTime': 1 }).exec()
    
    const assignments = JSON.parse(JSON.stringify(assignmentDocs))
    const totalMinutes = assignments.reduce((total: number, assignment: any) => {
      return total + assignment.assignmentDetails.estimatedDuration
    }, 0)
    
    return { totalAssignments: assignments.length, totalMinutes, assignments }
  }
}