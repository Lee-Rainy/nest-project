import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as svgCaptcha from 'svg-captcha';
import { generateUUID } from 'src/utils';

@Injectable()
export class CaptchaService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async createCaptcha(timeout: number) {
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      noise: 2, // 干扰线
      color: true,
      background: '#cc9966',
    });
    const captchaId = generateUUID();
    await this.redis.set(captchaId, captcha.text.toLowerCase(), 'EX', timeout);
    return {
      svg: captcha.data,
      text: captcha.text,
      captchaID: captchaId,
    };
  }

  async validateCaptcha(captchaId: string, code: string): Promise<boolean> {
    const saved = await this.redis.get(captchaId);
    if (saved && saved === code.toLowerCase()) {
      await this.redis.del(captchaId);
      return true;
    }
    return false;
  }
}
