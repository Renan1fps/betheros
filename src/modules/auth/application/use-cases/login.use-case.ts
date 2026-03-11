import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import { JwtPayload, AuthTokens } from '../../domain/token.entity';

export interface LoginInput {
    email: string;
    password: string;
}

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(input: LoginInput): Promise<AuthTokens> {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}