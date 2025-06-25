import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TeamsService } from "./teams.service"
import { TeamsController } from "./teams.controller"
import { TeamMember, TeamMemberSchema } from "./schemas/team-member.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: TeamMember.name, schema: TeamMemberSchema }])],
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}
