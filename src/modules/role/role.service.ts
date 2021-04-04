import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entity/role.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>
  ) {}
}
