import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  phone?: string;

  @IsOptional()
  username?: string;

  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6到20位之间' })
  password: string;
}
