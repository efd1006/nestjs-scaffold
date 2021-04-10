import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { RoleEntity } from './entity/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './dto'
@Crud({
  model: {
    type: RoleEntity
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
  query: {
    join: {
      permissions: {
        eager: false
      }
    },
    sort: [
      {
        field: 'id',
        order: 'DESC'
      }
    ]
  },
  dto: {
    create: CreateRoleDTO,
    update: UpdateRoleDTO
  }
})

@ApiTags('Roles')
@Controller('role')
export class RoleController implements CrudController<RoleEntity> {

  constructor(public service: RoleService) {}

  get base(): CrudController<RoleEntity> {
    return this
  }

  @Override('createOneBase')
  async createRole(
    @ParsedBody() dto: CreateRoleDTO
  ) {
    return await this.service.createRole(dto)
  }

  @Override('updateOneBase')
  async updateRole(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateRoleDTO
  ) {
    return await this.service.updateRole(req, dto)
  }
}
