import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { PermissionEntity } from '../entity/permission.entity';
import { PERMISSIONS_PREFIX } from '../enums';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const resource = this.reflector.get<string>('resource', context.getHandler());
    return await this.checkPermissions(resource, context);
  }

  private async checkPermissions(resource: string, context: ExecutionContext): Promise<boolean> {
    if (!resource) {
      // meaning this is public because the HasPermissionDecorator is not present in the route
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role
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
