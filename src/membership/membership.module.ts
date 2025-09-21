import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MembershipService } from "./membership.service"
import { MembershipController } from "./membership.controller"
import { Membership, MembershipSchema, ClientMembership, ClientMembershipSchema } from "./schemas/membership.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: ClientMembership.name, schema: ClientMembershipSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
