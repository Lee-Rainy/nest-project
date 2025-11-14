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
import express from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Public()
  @Get('code')
  async createCaptcha(@Req() req) {
    return await this.captchaService.createCaptcha(60);
    const { svg, captchaID } = await this.captchaService.createCaptcha(60);
    return { svg, captchaID };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: express.Response) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: true, // 生产环境建议开启，要求 HTTPS
      sameSite: 'strict', // 可选: 'lax' | 'strict' | 'none'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    return { access_token };
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
