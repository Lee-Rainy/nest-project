import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CaptchaService } from 'src/captcha/captcha.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly captchaService: CaptchaService) {
    super();
  }

  // 先校验 captcha，再交给 passport-local 做用户名/密码校验
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { code, captchaID } = req.body || {};

    // 简单校验：没有验证码直接拒绝
    if (!code || !captchaID) {
      throw new UnauthorizedException('验证码错误');
    }

    const valid = await this.captchaService.validateCaptcha(captchaID, code);
    if (!valid) {
      throw new UnauthorizedException('验证码错误或已过期');
    }
    // 验证通过后继续执行 passport local 验证（会把 user attach 到 req.user）
    // 注意：super.canActivate 可能返回 Promise<boolean> 或 Observable<boolean>
    return (await super.canActivate(context)) as boolean;
  }

  // 可选：定制 handleRequest 以便在验证失败时抛出更友好的错误
  handleRequest(err: any, user: any, info: any) {
    if (err) throw err;
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
