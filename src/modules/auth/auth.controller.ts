import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';
import { Request } from 'express';
import { CurrentUser } from '../../shared/decorators';
import { UserEntity } from '../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return await this.authService.login(dto)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('refresh')
  @ApiBearerAuth()
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(
      req.headers.authorization.split('Bearer ')[1],
    );
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(
    @CurrentUser() currentUser: UserEntity
  ) {
    return await this.authService.logout(currentUser)
  }
  
}
