import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { LoginDto, AuthResponseDto } from '../dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    @Post('login')
    @ApiOperation({ summary: 'Login com email e senha' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.loginUseCase.execute(dto);
    }
}