import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import * as ormconfig from './ormconfig';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import 'dotenv/config'
import { NODE_ENV } from './shared/enums';

let winstoTransports = []

if(process.env.ENV === NODE_ENV.PRODUCTION) {
  winstoTransports = [
    new winston.transports.File({ filename: `logs/${new Date().toLocaleDateString().replace(/\//g, '-')}/error.log`, level: 'error' })
  ]
}else {
  winstoTransports = [
    new winston.transports.Console()
  ]
}

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    WinstonModule.forRoot({
      transports: winstoTransports
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
