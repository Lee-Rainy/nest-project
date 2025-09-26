import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1695299999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
        \`uuid\` CHAR(36) NOT NULL UNIQUE COMMENT '用户唯一标识（对外使用）',
        
        \`username\` VARCHAR(50) UNIQUE DEFAULT NULL COMMENT '用户名（可选，展示用）',
        \`phone\` VARCHAR(20) UNIQUE DEFAULT NULL COMMENT '手机号（可为空）',
        \`email\` VARCHAR(100) UNIQUE DEFAULT NULL COMMENT '邮箱（可为空）',
        \`password_hash\` VARCHAR(255) NOT NULL COMMENT '密码哈希',
        \`salt\` VARCHAR(32) DEFAULT NULL COMMENT '密码加盐（可选）',

        \`oauth_provider\` VARCHAR(50) DEFAULT NULL COMMENT '第三方平台，如 wechat, google',
        \`oauth_id\` VARCHAR(100) DEFAULT NULL COMMENT '第三方平台用户ID',

        \`status\` TINYINT NOT NULL DEFAULT 1 COMMENT '用户状态: 1正常, 0禁用, -1注销',
        \`is_verified\` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已验证: 0未验证 1已验证',

        \`last_login_ip\` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
        \`last_login_time\` DATETIME DEFAULT NULL COMMENT '最后登录时间',

        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
