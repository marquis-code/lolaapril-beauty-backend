import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessVerificationDocument = BusinessVerification & Document;

@Schema({ timestamps: true })
export class BusinessVerification {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, unique: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  status: string; // 'pending', 'in_review', 'verified', 'rejected'

  @Prop({ required: true })
  verificationLevel: string; // 'basic', 'standard', 'premium'

  @Prop({ type: Object })
  businessDocuments: {
    businessRegistration: {
      url: string;
      verified: boolean;
      verifiedAt: Date;
    };
    taxId: {
      number: string;
      verified: boolean;
      verifiedAt: Date;
    };
    businessLicense: {
      url: string;
      verified: boolean;
      verifiedAt: Date;
    };
    professionalCertificates: {
      url: string;
      type: string;
      verified: boolean;
      verifiedAt: Date;
    }[];
  };

  @Prop({ type: Object })
  ownerVerification: {
    idType: string; // 'passport', 'national_id', 'drivers_license'
    idNumber: string;
    idDocument: string;
    verified: boolean;
    verifiedAt: Date;
  };

  @Prop({ type: Object })
  addressVerification: {
    address: string;
    proofDocument: string;
    verified: boolean;
    verifiedAt: Date;
  };

  @Prop({ type: [String] })
  verificationNotes: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verifiedBy: Types.ObjectId;

  @Prop()
  verifiedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Object })
  qualityMetrics: {
    responseRate: number; // Percentage
    avgResponseTime: number; // Minutes
    completionRate: number; // Percentage
    cancellationRate: number; // Percentage
    onTimeRate: number; // Percentage
  };
}

export const BusinessVerificationSchema = SchemaFactory.createForClass(BusinessVerification);


