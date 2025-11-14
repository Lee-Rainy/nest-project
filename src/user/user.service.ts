import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateUUID } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private readonly users = [
    {
      userid: 1,
      username: 'lee_rain',
      password: '123',
    },
  ];

  async register(dto: CreateUserDto) {
    console.log(dto);
    if (!dto.phone && !dto.email) {
      throw new BadRequestException('邮箱或手机号必须填写一个');
    }

    // 2. 查重
    if (dto.email) {
      const exists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new BadRequestException('邮箱已注册');
    }
    if (dto.phone) {
      const exists = await this.userRepo.findOne({
        where: { phone: dto.phone },
      });
      if (exists) throw new BadRequestException('手机号已注册');
    }

    // 4. 生成密码哈希
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const userMax = await this.userRepo.count();

    // 5. 保存用户
    const user = this.userRepo.create({
      username: dto.username ?? `新用户${userMax + 1}`,
      uuid: generateUUID(),
      email: dto.email,
      phone: dto.phone,
      password_hash: hash,
      salt,
    });

    return this.userRepo.save(user);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.users.map((user) => ({ name: user.username }));
  }

  async findOne(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new BadRequestException('该用户不存在');
    return user;
  }

  async validateUser(username: string, pwd: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new BadRequestException('该用户不存在');

    const isMatch = await bcrypt.compare(pwd, user.password_hash);
    if (!isMatch) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
