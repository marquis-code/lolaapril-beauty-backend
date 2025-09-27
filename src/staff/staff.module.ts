// src/modules/staff/staff.module.ts
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Controllers
import { StaffController } from './staff.controller'

// Services
import { StaffService } from './staff.service'

// Schemas
import { Staff, StaffSchema } from './schemas/staff.schema'
import { StaffSchedule, StaffScheduleSchema } from './schemas/staff-schedule.schema'
import { StaffAssignment, StaffAssignmentSchema } from './schemas/staff-assignment.schema'
import { WorkingHours, WorkingHoursSchema } from './schemas/working-hours.schema'

// Import related modules (using forwardRef to prevent circular dependencies)
import { TenantModule } from '../tenant/tenant.module'
import { AuthModule } from '../auth/auth.module'
import { ServiceModule } from '../service/service.module'

@Module({
  imports: [
    // Database schemas
    MongooseModule.forFeature([
      { name: Staff.name, schema: StaffSchema },
      { name: StaffSchedule.name, schema: StaffScheduleSchema },
      { name: StaffAssignment.name, schema: StaffAssignmentSchema },
      { name: WorkingHours.name, schema: WorkingHoursSchema },
    ]),
    
    // Related modules
    forwardRef(() => TenantModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ServiceModule),
  ],
  
  controllers: [StaffController],
  
  providers: [StaffService],
  
  exports: [StaffService],
})
export class StaffModule {}