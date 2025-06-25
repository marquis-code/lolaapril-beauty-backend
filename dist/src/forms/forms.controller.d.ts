import { FormsService } from "./forms.service";
import { CreateFormDto } from "./dto/create-form.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
import { SubmitFormDto } from "./dto/submit-form.dto";
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    create(createFormDto: CreateFormDto): Promise<import("./schemas/form.schema").Form>;
    findAll(): Promise<import("./schemas/form.schema").Form[]>;
    findOne(id: string): Promise<import("./schemas/form.schema").Form>;
    getSubmissions(id: string): Promise<import("./schemas/form-submission.schema").FormSubmission[]>;
    submitForm(id: string, submitFormDto: SubmitFormDto): Promise<import("./schemas/form-submission.schema").FormSubmission>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<import("./schemas/form.schema").Form>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/form.schema").Form>;
}
