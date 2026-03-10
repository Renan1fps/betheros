import {IsEmail, IsOptional, IsString, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from "@modules/users/domain/entities/user.entity";

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'google' })
  @IsString()
  provider: string;

  @ApiProperty({ example: '82f4e05f-850b-46bd-9f56-0a08db3ea837' })
  @IsString()
  @IsOptional()
  providerUserId?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
