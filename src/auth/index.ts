export { 
  BusinessContext, 
  BusinessId, 
  CurrentUser 
} from './decorators/business-context.decorator'
export type { BusinessContext as BusinessContextType } from './decorators/business-context.decorator'

// Guards
export { JwtAuthGuard } from './guards/jwt-auth.guard'
export { GoogleAuthGuard } from './guards/google-auth.guard'
export { RolesGuard } from './guards/roles.guard'
export { 
  BusinessAuthGuard, 
  BusinessRolesGuard, 
  RequireBusinessRoles 
} from './guards/business-auth.guard'

// Interfaces
export type { 
  JwtPayload, 
  RequestWithUser 
} from './types/request-with-user.interface'
export { hasBusinessContext } from './types/request-with-user.interface'

// Schemas and Enums
export { UserRole, UserStatus } from './schemas/user.schema'
export type { User, UserDocument } from './schemas/user.schema'

// DTOs
export { RegisterDto } from './dto/register.dto'
export { LoginDto } from './dto/login.dto'
export { 
  BusinessRegisterDto, 
  BusinessLoginDto, 
  GoogleAuthDto 
} from './dto/business-register.dto'
export { 
  UpdateProfileDto, 
  ChangePasswordDto, 
  UpdateEmailDto, 
  UserPreferencesDto 
} from './dto/update-profile.dto'

// Module
export { AuthModule } from './auth.module'

// Service (if you need to inject it in other modules)
export { AuthService } from './auth.service'