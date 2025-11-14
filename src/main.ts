import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { JwtGuard } from './auth/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import 'global-agent/bootstrap';
// somewhere in your initialization file

async function bootstrap() {
  // Enable CORS for all origins
  const app = await NestFactory.create(AppModule, { cors: true });

  // 注册拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局注册 JwtAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtGuard(reflector));
  // 使用session
  app.use(
    session({
      secret: 'LeeRain',
      name: 'LeeRain.sid',
      cookie: { maxAge: 600000 }, // 10 minutes
      resave: false,
      saveUninitialized: false,
    }),
  );

  // 启用管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动去掉 DTO 中不存在的字段
      forbidNonWhitelisted: true,
      transform: true, // 自动类型转换
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
