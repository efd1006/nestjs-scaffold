import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { PERMISSIONS_PREFIX, ROUTE_RESOURCE } from '../../modules/permission/enums';

export default class SeedPermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'permissions';

    let permissions = [
      {
        name: `${PERMISSIONS_PREFIX.CREATE}${ROUTE_RESOURCE.ROLES}`
      },
      {
        name: `${PERMISSIONS_PREFIX.READ}${ROUTE_RESOURCE.ROLES}`
      },
      {
        name: `${PERMISSIONS_PREFIX.UPDATE}${ROUTE_RESOURCE.ROLES}`
      },
      {
        name: `${PERMISSIONS_PREFIX.DELETE}${ROUTE_RESOURCE.ROLES}`
      },
      {
        name: `${PERMISSIONS_PREFIX.CREATE}${ROUTE_RESOURCE.PERMISSIONS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.READ}${ROUTE_RESOURCE.PERMISSIONS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.UPDATE}${ROUTE_RESOURCE.PERMISSIONS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.DELETE}${ROUTE_RESOURCE.PERMISSIONS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.CREATE}${ROUTE_RESOURCE.USERS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.READ}${ROUTE_RESOURCE.USERS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.UPDATE}${ROUTE_RESOURCE.USERS}`
      },
      {
        name: `${PERMISSIONS_PREFIX.DELETE}${ROUTE_RESOURCE.USERS}`
      },
    ];
    await connection.getRepository(tableName).save([...permissions], { chunk: 500 });
  }
}
