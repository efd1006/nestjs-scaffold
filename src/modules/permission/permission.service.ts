import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entity/role.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
  ) {}


  async findOneUser(condition, relations: string[] = []) {
    return await this.usersRepository.findOne(condition, {relations})
  }

  async findOneRole(condition, relations: string[] = []) {
    return await this.rolesRepository.findOne(condition, {relations})
  }
}
