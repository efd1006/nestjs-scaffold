import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedBody } from '@nestjsx/crud';
import { HasPermissionDecorator } from './decorators';
import { CreatePermissionDTO } from './dto';
import { PermissionEntity } from './entity/permission.entity';
import { PERMISSIONS_PREFIX, ROUTE_RESOURCE } from './enums';
import { PermissionGuard } from './guards';
import { PermissionService } from './permission.service';

@Crud({
  model: {
    type: PermissionEntity
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'updateOneBase', 'getOneBase'],
    getManyBase: {
      decorators: [HasPermissionDecorator(ROUTE_RESOURCE.PERMISSIONS)]
    },
    deleteOneBase: {
      decorators: [HasPermissionDecorator(ROUTE_RESOURCE.PERMISSIONS)]
    },
  },
  dto: {
    create: CreatePermissionDTO
  }
})

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('permission')
export class PermissionController implements CrudController<PermissionEntity> {

  constructor(
    public service: PermissionService
  ) {}

  get base(): CrudController<PermissionEntity> {
    return this
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.PERMISSIONS)
  @Override('createOneBase')
  async createRole(
    @ParsedBody() dto: CreatePermissionDTO
  ) {
    return await this.service.createPermission(dto)
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.PERMISSIONS)
  @Get('prefixes')
  listAllPermisionPrefix() {
    const permissionsPrefix = PERMISSIONS_PREFIX
    return Object.values(permissionsPrefix)
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.PERMISSIONS)
  @Get('resources')
  listAllRouteResource() { 
    const routeResources = ROUTE_RESOURCE
    return Object.values(routeResources)
  }

}
