import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    return user && user.password === pass ? user : null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userid };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'access-secret', // ⚠️ 改成 env
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refresh-secret', // ⚠️ 改成 env
      expiresIn: '3d',
    });

    await this.redis.set(
      `refresh:${user.userid}`,
      refreshToken,
      'EX',
      7 * 24 * 3600,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'refresh-secret',
      });

      // 重新生成 access_token
      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        {
          secret: 'access-secret',
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }
}
