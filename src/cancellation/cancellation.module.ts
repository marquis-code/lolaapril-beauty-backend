// // // ============================================================================
// // // 8. CANCELLATION MODULE
// // // src/cancellation/cancellation.module.ts
// // // ============================================================================

// // import { Module, forwardRef, Type } from '@nestjs/common'
// // import { MongooseModule } from '@nestjs/mongoose'
// // import { EventEmitterModule } from '@nestjs/event-emitter'
// // import { 
// //   CancellationPolicy, 
// //   CancellationPolicySchema 
// // } from './schemas/cancellation-policy.schema'
// // import { 
// //   NoShowRecord, 
// //   NoShowRecordSchema 
// // } from './schemas/no-show-record.schema'
// // import { 
// //   ClientReliability, 
// //   ClientReliabilitySchema 
// // } from './schemas/client-reliability.schema'
// // import { CancellationController } from './controllers/cancellation.controller'
// // import { CancellationPolicyService } from './services/cancellation-policy.service'
// // import { NoShowManagementService } from './services/no-show-management.service'
// // import { AppointmentModule } from '../appointment/appointment.module'
// // import { PaymentModule } from '../payment/payment.module'

// // @Module({
// //   imports: [
// //     MongooseModule.forFeature([
// //       { name: CancellationPolicy.name, schema: CancellationPolicySchema },
// //       { name: NoShowRecord.name, schema: NoShowRecordSchema },
// //       { name: ClientReliability.name, schema: ClientReliabilitySchema }
// //     ]),
// //     EventEmitterModule.forRoot(),
// //     forwardRef(() => AppointmentModule),
// //     forwardRef(() => PaymentModule)
// //   ],
// //   controllers: [CancellationController],
// //   providers: [
// //     CancellationPolicyService as Type<any>,
// //     NoShowManagementService as Type<any>
// //   ],
// //   exports: [
// //     CancellationPolicyService as Type<any>,
// //     NoShowManagementService as Type<any>
// //   ]
// // })
// // export class CancellationModule {}

// // // ==================== cancellation.module.ts (UPDATED) ====================
// // import { Module, forwardRef } from '@nestjs/common';
// // import { MongooseModule } from '@nestjs/mongoose';
// // import { EventEmitterModule } from '@nestjs/event-emitter';

// // // Schemas
// // import { 
// //   CancellationPolicy, 
// //   CancellationPolicySchema 
// // } from './schemas/cancellation-policy.schema';
// // import { 
// //   NoShowRecord, 
// //   NoShowRecordSchema 
// // } from './schemas/no-show-record.schema';
// // import { 
// //   ClientReliability, 
// //   ClientReliabilitySchema 
// // } from './schemas/client-reliability.schema';

// // // Controllers
// // import { CancellationController } from './controllers/cancellation.controller';

// // // Services
// // import { CancellationPolicyService } from './services/cancellation-policy.service';
// // import { NoShowManagementService } from './services/no-show-management.service';

// // // Imports
// // import { AuthModule } from '../auth/auth.module';
// // import { AppointmentModule } from '../appointment/appointment.module';
// // import { PaymentModule } from '../payment/payment.module';

// // @Module({
// //   imports: [
// //     MongooseModule.forFeature([
// //       { name: CancellationPolicy.name, schema: CancellationPolicySchema },
// //       { name: NoShowRecord.name, schema: NoShowRecordSchema },
// //       { name: ClientReliability.name, schema: ClientReliabilitySchema }
// //     ]),
// //     EventEmitterModule.forRoot(),
// //     AuthModule, // Import for guards and decorators
// //     forwardRef(() => AppointmentModule),
// //     forwardRef(() => PaymentModule)
// //   ],
// //   controllers: [CancellationController],
// //   providers: [
// //     CancellationPolicyService,
// //     NoShowManagementService
// //   ],
// //   exports: [
// //     CancellationPolicyService,
// //     NoShowManagementService
// //   ]
// // })
// // export class CancellationModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { EventEmitterModule } from '@nestjs/event-emitter';

// // Controllers
// import { CancellationController } from './controllers/cancellation.controller';

// // Services
// import { CancellationPolicyService } from './services/cancellation-policy.service';
// import { NoShowManagementService } from './services/no-show-management.service';

// // Schemas
// import { 
//   CancellationPolicy, 
//   CancellationPolicySchema 
// } from './schemas/cancellation-policy.schema';
// import { 
//   NoShowRecord, 
//   NoShowRecordSchema 
// } from './schemas/no-show-record.schema';
// import { 
//   ClientReliability, 
//   ClientReliabilitySchema 
// } from './schemas/client-reliability.schema';

// // Import AppointmentModule for AppointmentService
// import { AppointmentModule } from '../appointment/appointment.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: CancellationPolicy.name, schema: CancellationPolicySchema },
//       { name: NoShowRecord.name, schema: NoShowRecordSchema },
//       { name: ClientReliability.name, schema: ClientReliabilitySchema }
//     ]),
//     EventEmitterModule.forRoot(), // For event emission
//     AppointmentModule // Import to use AppointmentService
//   ],
//   controllers: [CancellationController],
//   providers: [
//     CancellationPolicyService,
//     NoShowManagementService
//   ],
//   exports: [
//     CancellationPolicyService,
//     NoShowManagementService
//   ]
// })
// export class CancellationModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { EventEmitterModule } from '@nestjs/event-emitter';

// // Controllers
// import { CancellationController } from './controllers/cancellation.controller';

// // Services
// import { CancellationPolicyService } from './services/cancellation-policy.service';
// import { NoShowManagementService } from './services/no-show-management.service';

// // Schemas - Import with type assertion
// import { 
//   CancellationPolicySchema 
// } from './schemas/cancellation-policy.schema';
// import { 
//   NoShowRecordSchema 
// } from './schemas/no-show-record.schema';
// import { 
//   ClientReliabilitySchema 
// } from './schemas/client-reliability.schema';

// // Import AppointmentModule for AppointmentService
// import { AppointmentModule } from '../appointment/appointment.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: 'CancellationPolicy', schema: CancellationPolicySchema },
//       { name: 'NoShowRecord', schema: NoShowRecordSchema },
//       { name: 'ClientReliability', schema: ClientReliabilitySchema }
//     ]),
//     EventEmitterModule.forRoot(),
//     AppointmentModule
//   ],
//   controllers: [CancellationController],
//   providers: [
//     CancellationPolicyService,
//     NoShowManagementService
//   ],
//   exports: [
//     CancellationPolicyService,
//     NoShowManagementService
//   ]
// })
// export class CancellationModule {}

// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import type { Provider } from '@nestjs/common';

// // Controllers
// import { CancellationController } from './controllers/cancellation.controller';

// // Services
// import { CancellationPolicyService } from './services/cancellation-policy.service';
// import { NoShowManagementService } from './services/no-show-management.service';

// // Schemas
// import { CancellationPolicySchema } from './schemas/cancellation-policy.schema';
// import { NoShowRecordSchema } from './schemas/no-show-record.schema';
// import { ClientReliabilitySchema } from './schemas/client-reliability.schema';

// // Import AppointmentModule
// import { AppointmentModule } from '../appointment/appointment.module';

// // Break type complexity by explicitly typing providers
// const moduleProviders: Provider[] = [
//   CancellationPolicyService,
//   NoShowManagementService
// ];

// const moduleExports = [
//   CancellationPolicyService,
//   NoShowManagementService
// ];

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: 'CancellationPolicy', schema: CancellationPolicySchema },
//       { name: 'NoShowRecord', schema: NoShowRecordSchema },
//       { name: 'ClientReliability', schema: ClientReliabilitySchema }
//     ]),
//     EventEmitterModule.forRoot(),
//     forwardRef(() => AppointmentModule)
//   ],
//   controllers: [CancellationController],
//   providers: moduleProviders,
//   exports: moduleExports
// })
// export class CancellationModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Controllers
import { CancellationController } from './controllers/cancellation.controller';

// Services
import { CancellationPolicyService } from './services/cancellation-policy.service';
import { NoShowManagementService } from './services/no-show-management.service';

// Schemas
import { CancellationPolicySchema } from './schemas/cancellation-policy.schema';
import { NoShowRecordSchema } from './schemas/no-show-record.schema';
import { ClientReliabilitySchema } from './schemas/client-reliability.schema';

// Import AppointmentModule
import { AppointmentModule } from '../appointment/appointment.module';

// NUCLEAR FIX: Remove type annotation completely
const moduleProviders = [
  CancellationPolicyService,
  NoShowManagementService
];

const moduleExports = [
  CancellationPolicyService,
  NoShowManagementService
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CancellationPolicy', schema: CancellationPolicySchema },
      { name: 'NoShowRecord', schema: NoShowRecordSchema },
      { name: 'ClientReliability', schema: ClientReliabilitySchema }
    ]),
    EventEmitterModule.forRoot(),
    forwardRef(() => AppointmentModule)
  ],
  controllers: [CancellationController],
  providers: moduleProviders,
  exports: moduleExports
})
export class CancellationModule {}