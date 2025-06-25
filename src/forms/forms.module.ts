import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FormsService } from "./forms.service"
import { FormsController } from "./forms.controller"
import { Form, FormSchema } from "./schemas/form.schema"
import { FormSubmission, FormSubmissionSchema } from "./schemas/form-submission.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: FormSchema },
      { name: FormSubmission.name, schema: FormSubmissionSchema },
    ]),
  ],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
