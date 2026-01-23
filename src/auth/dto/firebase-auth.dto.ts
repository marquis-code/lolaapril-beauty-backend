// src/modules/auth/dto/firebase-auth.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FirebaseAuthDto {
  @ApiProperty({
    description: 'Firebase ID token obtained from client-side Firebase authentication',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string

  @ApiProperty({
    description: 'Optional subdomain for business context',
    example: 'my-salon',
    required: false,
  })
  @IsString()
  @IsOptional()
  subdomain?: string
}
