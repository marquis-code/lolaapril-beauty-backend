import { Model } from "mongoose";
import { Form, FormDocument } from "./schemas/form.schema";
import { FormSubmission, FormSubmissionDocument } from "./schemas/form-submission.schema";
import { CreateFormDto } from "./dto/create-form.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
import { SubmitFormDto } from "./dto/submit-form.dto";
export declare class FormsService {
    private formModel;
    private submissionModel;
    constructor(formModel: Model<FormDocument>, submissionModel: Model<FormSubmissionDocument>);
    create(createFormDto: CreateFormDto): Promise<Form>;
    findAll(): Promise<Form[]>;
    findOne(id: string): Promise<Form>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<Form>;
    submitForm(id: string, submitFormDto: SubmitFormDto): Promise<FormSubmission>;
    getSubmissions(formId: string): Promise<FormSubmission[]>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<Form>;
}
