import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RoleEntity } from '../../modules/role/entity/role.entity';
import { PermissionEntity } from '../../modules/permission/entity/permission.entity';

export default class AdminPermissionSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    const adminRole = await connection.getRepository(RoleEntity).findOne({where: {name: 'Admin'}})

    const permissions = await connection.getRepository(PermissionEntity).find()

    const permissionIds = permissions.map(p => p.id)

    await connection.getRepository(RoleEntity).save({
      ...adminRole,
      permissions: permissionIds.map(id => ({id}))
    })
  }
}