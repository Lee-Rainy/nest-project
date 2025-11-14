# Nest Project — 功能批注

简要说明：这是一个基于 NestJS 的后端服务模版，集成了认证、用户管理、图片验证码、Redis、TypeORM 和（占位）聊天模块，便于快速开发与扩展。

快速启动
- 安装依赖：参见 [package.json](package.json) 的 scripts。
  - 本地开发：npm run start:dev
  - 打包运行：npm run build && npm run start:prod

核心模块与功能（按文件/符号对应）
- 应用入口 / 模块装配  
  - [`AppModule`](src/app.module.ts) — 主模块，加载各子模块并配置 TypeORM（MySQL）和全局 Config。[src/app.module.ts](src/app.module.ts)

- 认证（Auth）  
  - [`AuthModule`](src/auth/auth.module.ts) — 登录/刷新 token、用户信息等 API 集合。[src/auth/auth.module.ts](src/auth/auth.module.ts)  
  - 相关控制器/服务：[`AuthController`](src/auth/auth.controller.ts) / [`AuthService`](src/auth/auth.service.ts)（处理登录、验证码校验、token 签发）。[src/auth/auth.controller.ts](src/auth/auth.controller.ts) [src/auth/auth.service.ts](src/auth/auth.service.ts)  
  - JWT 策略：[`jwt.strategy.ts`](src/auth/jwt.strategy.ts)（验证 token）。[src/auth/jwt.strategy.ts](src/auth/jwt.strategy.ts)

- 用户（User）
  - [`UserModule`](src/user/user.module.ts) & [`UserService`](src/user/user.service.ts) — 注册、查询、更新用户接口（目前 service 有示例内存数据和未实现的 DB 操作占位）。[src/user/user.module.ts](src/user/user.module.ts) [src/user/user.service.ts](src/user/user.service.ts)

- 验证码（Captcha）
  - [`CaptchaModule`](src/captcha/captcha.module.ts) / [`CaptchaService`](src/captcha/captcha.service.ts) / [`CaptchaController`](src/captcha/captcha.controller.ts) — 生成 SVG 验证码并在 Redis 中短期保存用于校验；代码使用了 [`svg-captcha`](pnpm-lock.yaml#L3192) 和 Redis 客户端。[src/captcha/captcha.service.ts](src/captcha/captcha.service.ts) [src/captcha/captcha.controller.ts](src/captcha/captcha.controller.ts)

- Redis 全局客户端
  - [`RedisModule`](src/redis/redis.module.ts) — 全局注入 ioredis 客户端，供验证码与其他缓存使用。[src/redis/redis.module.ts](src/redis/redis.module.ts)

- TypeORM / 数据迁移
  - 通过 TypeORM 连接 MySQL（配置在 [`AppModule`](src/app.module.ts) 中）。[src/app.module.ts](src/app.module.ts)  
  - 示例迁移：[`CreateUserTable1695299999999`](src/migrations/CreateUserTable.ts) — 用户表结构定义（含 uuid、username、password_hash 等字段）。[src/migrations/CreateUserTable.ts](src/migrations/CreateUserTable.ts)

- 聊天（Chat）模块（占位）
  - [`ChatModule`](src/chat/chat.module.ts) 目前只有模块声明，需补充控制器与服务以实现消息发送/接收、持久化或 WebSocket 支持。[src/chat/chat.module.ts](src/chat/chat.module.ts)

开发与改进建议（优先级）
- 安全（高）
  - 将 JWT secret、数据库与 Redis 凭证移入环境变量（ConfigModule 已启用）。[src/app.module.ts](src/app.module.ts) [package.json](package.json)
  - 使用 bcrypt 或更强哈希替代明文/不安全的密码处理（参考 `bcrypt` 依赖已列在 lockfile）。[src/user/user.service.ts](src/user/user.service.ts)
- 功能（中）
  - 完善 [`ChatModule`](src/chat/chat.module.ts)：增加 WebSocket 支持、ChatService、ChatController 与消息存储。 [src/chat/chat.module.ts](src/chat/chat.module.ts)
  - 将 UserService 中的内存示例替换为真实的 Repository 操作（使用注入的 TypeORM Repository）。[src/user/user.service.ts](src/user/user.service.ts)
- 质量（中）
  - 补充单元测试（test/ 与各模块的 *.spec.ts 已存在占位）。
  - 完善错误处理与返回规范。

依赖与兼容性
- 依赖管理使用 pnpm，详细版本记录见 [pnpm-lock.yaml](pnpm-lock.yaml)（示例：`svg-captcha@1.4.0`、`ioredis@5.8.0`、`@nestjs/*` 等）。[pnpm-lock.yaml](pnpm-lock.yaml)

文件快速入口
- 主入口：[src/main.ts](src/main.ts)
- 主模块：[src/app.module.ts](src/app.module.ts)
- 认证：[src/auth/auth.controller.ts](src/auth/auth.controller.ts)
- 用户：[src/user/user.service.ts](src/user/user.service.ts)
- 验证码：[src/captcha/captcha.service.ts](src/captcha/captcha.service.ts)
- Redis 注入：[src/redis/redis.module.ts](src/redis/redis.module.ts)
- 聊天模块占位：[src/chat/chat.module.ts](src/chat/chat.module.ts)
