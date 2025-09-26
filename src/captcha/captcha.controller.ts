import { Controller, Get, Query } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}
}
