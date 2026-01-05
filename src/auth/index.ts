export { Public } from './decorators/public.decorator'
export { ValidateBusiness } from './decorators/validate-business.decorator'

// Keep all your existing exports...
export { 
  BusinessContext, 
  BusinessId, 
  CurrentUser 
} from './decorators/business-context.decorator'
export type { BusinessContext as BusinessContextType } from './decorators/business-context.decorator'

export { JwtAuthGuard } from './guards/jwt-auth.guard'
export { GoogleAuthGuard } from './guards/google-auth.guard'
export { RolesGuard } from './guards/roles.guard'
export { 
  BusinessAuthGuard, 
  BusinessRolesGuard, 
  RequireBusinessRoles 
} from './guards/business-auth.guard'
export { ValidateBusinessAccessGuard } from './guards/validate-business-access.guard'
export { OptionalAuthGuard } from './guards/optional-auth.guard'

export type { 
  JwtPayload, 
  RequestWithUser 
} from './types/request-with-user.interface'
export { hasBusinessContext } from './types/request-with-user.interface'

export { UserRole, UserStatus } from './schemas/user.schema'
export type { User, UserDocument } from './schemas/user.schema'

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
export { SwitchBusinessDto } from './dto/switch-business.dto'

export { AuthModule } from './auth.module'
export { AuthService } from './auth.service'