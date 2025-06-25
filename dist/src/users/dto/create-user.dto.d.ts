import { UserRole } from "../../common/enums";
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
}
