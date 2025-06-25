import { Model } from "mongoose";
import { Program, ProgramDocument } from "./schemas/program.schema";
import { ProgramApplication, ProgramApplicationDocument } from "./schemas/program-application.schema";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { SubmitApplicationDto } from "./dto/submit-application.dto";
import { ProgramStatus } from "../common/enums";
export declare class ProgramsService {
    private programModel;
    private applicationModel;
    constructor(programModel: Model<ProgramDocument>, applicationModel: Model<ProgramApplicationDocument>);
    create(createProgramDto: CreateProgramDto): Promise<Program>;
    findAll(status?: ProgramStatus): Promise<Program[]>;
    findActive(): Promise<Program[]>;
    findOne(id: string): Promise<Program>;
    findByRegistrationToken(token: string): Promise<Program>;
    update(id: string, updateProgramDto: UpdateProgramDto): Promise<Program>;
    activate(id: string): Promise<Program>;
    deactivate(id: string): Promise<Program>;
    getRegistrationLink(id: string): Promise<{
        registrationLink: string;
    }>;
    submitApplication(token: string, applicationDto: SubmitApplicationDto): Promise<ProgramApplication>;
    getApplications(programId: string): Promise<ProgramApplication[]>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<Program>;
}
