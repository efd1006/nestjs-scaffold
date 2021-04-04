import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuthSessionEntity } from './entity/user_auth_session.entity';
import { JWTStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserAuthSessionEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [PassportModule, JWTStrategy, AuthService]
})
export class AuthModule {}
