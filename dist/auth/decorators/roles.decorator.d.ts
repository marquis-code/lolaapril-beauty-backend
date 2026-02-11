import type { UserRole } from "../schemas/user.schema";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
