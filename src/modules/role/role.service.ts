import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDTO, UpdateRoleDTO } from './dto';
import { RoleEntity } from './entity/role.entity';
import { PermissionEntity } from '../permission/entity/permission.entity';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class RoleService extends TypeOrmCrudService<RoleEntity> {

  constructor(
    @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity) private permissionsRepository: Repository<PermissionEntity>
  ) {
    super(rolesRepository)
  }

  async createRole(dto: CreateRoleDTO) {
    try {
      const permissions = await this.permissionsRepository.find({
        where: { id: In(dto.permissionIds) }
      })

      await this.rolesRepository.save({
        name: dto.name,
        permissions: permissions
      })
      
      return {
        message: 'New Role has been successfully created.'
      }
    }catch(e) {
      throw new HttpException(String(e), HttpStatus.BAD_REQUEST)
    }
  }

  async updateRole(req: CrudRequest, dto: UpdateRoleDTO) {
    try {
      const roleId = req.parsed.paramsFilter[0].value
      
      // check if role exist
      const role = await this.rolesRepository.findOne({where: {id: roleId}})
      if(!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
      }

      const permissions = await this.permissionsRepository.find({
        where: { id: In(dto.permissionIds) }
      })

      role.name = dto.name
      role.permissions = permissions
      
      await this.rolesRepository.save(role)
      
      return {
        message: `Role has been updated successsfully.`
      }

    }catch(e) {
      throw new HttpException(String(e), HttpStatus.BAD_REQUEST)
    }
  }
}
