import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TeamService } from "./team.service"
import { TeamController } from "./team.controller"
import { TeamMember, TeamMemberSchema } from "./schemas/team-member.schema"
import { Service, ServiceSchema } from '../service/schemas/service.schema'
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [MongooseModule.forFeature([
    { name: TeamMember.name, schema: TeamMemberSchema }, { name: Service.name, schema: ServiceSchema },]), AuditModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
