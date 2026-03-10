import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './infrastructure/http/controllers/auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as unknown as number ?? '7d' },
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        JwtAuthGuard,
        LoginUseCase,
    ],
    exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}