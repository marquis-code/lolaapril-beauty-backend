import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MembershipService } from "./membership.service"
import { MembershipController } from "./membership.controller"
import { Membership, MembershipSchema } from "./schemas/membership.schema"
import { ClientMembership, ClientMembershipSchema } from "./schemas/client-membership.schema"
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: ClientMembership.name, schema: ClientMembershipSchema },
    ]),
    AuditModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
