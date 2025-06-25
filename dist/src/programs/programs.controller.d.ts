import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { SubmitApplicationDto } from "./dto/submit-application.dto";
import { type ProgramStatus } from "../common/enums";
export declare class ProgramsController {
    private readonly programsService;
    constructor(programsService: ProgramsService);
    create(createProgramDto: CreateProgramDto): Promise<import("./schemas/program.schema").Program>;
    findAll(status?: ProgramStatus): Promise<import("./schemas/program.schema").Program[]>;
    findActive(): Promise<import("./schemas/program.schema").Program[]>;
    findOne(id: string): Promise<import("./schemas/program.schema").Program>;
    getRegistrationLink(id: string): Promise<{
        registrationLink: string;
    }>;
    getApplications(id: string): Promise<import("./schemas/program-application.schema").ProgramApplication[]>;
    submitApplication(token: string, applicationDto: SubmitApplicationDto): Promise<import("./schemas/program-application.schema").ProgramApplication>;
    update(id: string, updateProgramDto: UpdateProgramDto): Promise<import("./schemas/program.schema").Program>;
    activate(id: string): Promise<import("./schemas/program.schema").Program>;
    deactivate(id: string): Promise<import("./schemas/program.schema").Program>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/program.schema").Program>;
}
