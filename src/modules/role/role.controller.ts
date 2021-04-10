import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { RoleEntity } from './entity/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './dto'
import { HasPermissionDecorator } from '../permission/decorators';
import { ROUTE_RESOURCE } from '../permission/enums';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from '../permission/guards';
@Crud({
  model: {
    type: RoleEntity
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
    // since createOneBase and updateOneBase are Overriden we need to put the decorator and guards above the @Override. See below
    getOneBase: {
      decorators: [HasPermissionDecorator(ROUTE_RESOURCE.ROLES)]
    },
    getManyBase: {
      decorators: [HasPermissionDecorator(ROUTE_RESOURCE.ROLES)]
    },
    deleteOneBase: {
      decorators: [HasPermissionDecorator(ROUTE_RESOURCE.ROLES)]
    },
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
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('role')
export class RoleController implements CrudController<RoleEntity> {

  constructor(public service: RoleService) {}

  get base(): CrudController<RoleEntity> {
    return this
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.ROLES)
  @Override('createOneBase')
  async createRole(
    @ParsedBody() dto: CreateRoleDTO
  ) {
    return await this.service.createRole(dto)
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.ROLES)
  @Override('updateOneBase')
  async updateRole(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateRoleDTO
  ) {
    return await this.service.updateRole(req, dto)
  }
}
