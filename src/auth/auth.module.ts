import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CaptchaController } from 'src/captcha/captcha.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt.guard';
import { CaptchaService } from 'src/captcha/captcha.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    LocalAuthGuard,
    JwtGuard,
    CaptchaService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController, CaptchaController],
  exports: [LocalAuthGuard],
})
export class AuthModule {}
