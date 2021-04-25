import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../role/entity/role.entity';
import { RoleModule } from '../role/role.module';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { PermissionEntity } from './entity/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, 
      RoleEntity, 
      PermissionEntity
    ])
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
