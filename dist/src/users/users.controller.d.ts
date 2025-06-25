import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").User>;
    create(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").User>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/user.schema").User>;
}
