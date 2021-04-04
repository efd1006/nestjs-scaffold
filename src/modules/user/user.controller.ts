import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasPermissionDecorator } from '../permission/decorators';
import { ROUTE_RESOURCE } from '../permission/enums';
import { PermissionGuard } from '../permission/guards';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HasPermissionDecorator(ROUTE_RESOURCE.USERS)
  @Get()
  async findAll() {
    return await this.userService.findAll()
  }

}
