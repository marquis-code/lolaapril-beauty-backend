// ============================================================================
// 8. CANCELLATION MODULE
// src/cancellation/cancellation.module.ts
// ============================================================================

import { Module, forwardRef, Type } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { 
  CancellationPolicy, 
  CancellationPolicySchema 
} from './schemas/cancellation-policy.schema'
import { 
  NoShowRecord, 
  NoShowRecordSchema 
} from './schemas/no-show-record.schema'
import { 
  ClientReliability, 
  ClientReliabilitySchema 
} from './schemas/client-reliability.schema'
import { CancellationController } from './controllers/cancellation.controller'
import { CancellationPolicyService } from './services/cancellation-policy.service'
import { NoShowManagementService } from './services/no-show-management.service'
import { AppointmentModule } from '../appointment/appointment.module'
import { PaymentModule } from '../payment/payment.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CancellationPolicy.name, schema: CancellationPolicySchema },
      { name: NoShowRecord.name, schema: NoShowRecordSchema },
      { name: ClientReliability.name, schema: ClientReliabilitySchema }
    ]),
    EventEmitterModule.forRoot(),
    forwardRef(() => AppointmentModule),
    forwardRef(() => PaymentModule)
  ],
  controllers: [CancellationController],
  providers: [
    CancellationPolicyService as Type<any>,
    NoShowManagementService as Type<any>
  ],
  exports: [
    CancellationPolicyService as Type<any>,
    NoShowManagementService as Type<any>
  ]
})
export class CancellationModule {}