import { Controller, Post, Request } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { Audit } from "../common/decorators/audit.decorator"
import { AuditAction } from "../common/enums"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @Audit(AuditAction.LOGIN, "auth")
  async login(@Request() req) {
    const loginDto: LoginDto = req.body
    return this.authService.login(loginDto)
  }
}
