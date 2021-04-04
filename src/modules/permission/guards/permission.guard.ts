import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { PermissionEntity } from '../entity/permission.entity';
import { PERMISSIONS_PREFIX } from '../enums';
import { PermissionService } from '../permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const resource = this.reflector.get<string>('resource', context.getHandler());
    // console.log(resource);
    return await this.checkPermissions(resource, context);

  }

  private async checkPermissions(resource: string, context: ExecutionContext): Promise<boolean> {
  
    if (!resource) {
      // meaning this is public because the HasPermissionDecorator id not present in the specific route
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.permissionService.findOneUser({ id: request.user.id }, ['role']);
    const userRole = await this.permissionService.findOneRole({ id: user.role.id }, ['permissions']);
    // console.log(userRole);

    switch(request.method) {
      case 'GET':
        return userRole.permissions.some((p: PermissionEntity) => (p.name === `${PERMISSIONS_PREFIX.READ}${resource}`));
      case 'POST':
        return userRole.permissions.some((p: PermissionEntity) => (p.name === `${PERMISSIONS_PREFIX.CREATE}${resource}`));
      case 'PUT':
      case 'PATCH':
        return userRole.permissions.some((p: PermissionEntity) => (p.name === `${PERMISSIONS_PREFIX.UPDATE}${resource}`));
      case 'DELETE':
        return userRole.permissions.some((p: PermissionEntity) => (p.name === `${PERMISSIONS_PREFIX.DELETE}${resource}`));
    }
  }

}
