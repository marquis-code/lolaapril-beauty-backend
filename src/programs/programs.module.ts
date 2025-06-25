import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProgramsService } from "./programs.service"
import { ProgramsController } from "./programs.controller"
import { Program, ProgramSchema } from "./schemas/program.schema"
import { ProgramApplication, ProgramApplicationSchema } from "./schemas/program-application.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Program.name, schema: ProgramSchema },
      { name: ProgramApplication.name, schema: ProgramApplicationSchema },
    ]),
  ],
  providers: [ProgramsService],
  controllers: [ProgramsController],
})
export class ProgramsModule {}
