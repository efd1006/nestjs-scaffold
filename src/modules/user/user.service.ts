import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>
  ) {}

  async findAll() {
    return await this.usersRepository.find()
  }
}
