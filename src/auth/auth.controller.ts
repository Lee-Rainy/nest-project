import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CaptchaService } from 'src/captcha/captcha.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Get('code')
  async createCaptcha(@Req() req) {
    const { svg, captchaID } = await this.captchaService.createCaptcha(60);
    return { svg, captchaID };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // 获取用户信息（需要 access_token）
  @HttpCode(200)
  @Post('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // 刷新 access_token
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body('refresh_token') token: string) {
    return this.authService.refreshToken(token);
  }
}
