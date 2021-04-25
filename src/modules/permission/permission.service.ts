import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto';
import { PermissionEntity } from './entity/permission.entity';
import { PERMISSIONS_PREFIX, ROUTE_RESOURCE } from './enums';

@Injectable()
export class PermissionService extends TypeOrmCrudService<PermissionEntity> {

  constructor(
    @InjectRepository(PermissionEntity) private permissionsRepository: Repository<PermissionEntity>
  ) {
    super(permissionsRepository)
  }

  async createPermission(dto: CreatePermissionDTO) {
    try {
      // check if valid permission name is valid
      const permissionsPrefix = Object.values(PERMISSIONS_PREFIX) as string[]
      const routeResources= Object.values(ROUTE_RESOURCE) as string[]
      const p = dto.name.split('_')
      if(!permissionsPrefix.includes(`${p[0]}_`) || !routeResources.includes(p[1])) {
        throw new HttpException('Inavlid permission. The format must be a valid <prefix>_<resource>', HttpStatus.BAD_REQUEST)
      }
      const permission = await this.permissionsRepository.create(dto)
      await this.permissionsRepository.save(permission)
      return {
        message: "New permission has been successfully created."
      }
    }catch(e) {
      throw new HttpException(e.details || String(e), HttpStatus.BAD_REQUEST)
    }
  }
}
