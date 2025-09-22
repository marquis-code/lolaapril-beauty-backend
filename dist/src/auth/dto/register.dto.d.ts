import { UserRole } from "../schemas/user.schema";
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
}
