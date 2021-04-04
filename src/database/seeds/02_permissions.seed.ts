import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { PERMISSIONS_PREFIX } from '../../shared/enums';

export default class SeedPermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'permissions';

    let permissions = [
      {
        name: `${PERMISSIONS_PREFIX.CREATE}USERS`
      },
      {
        name: `${PERMISSIONS_PREFIX.READ}USERS`
      },
      {
        name: `${PERMISSIONS_PREFIX.UPDATE}USERS`
      },
      {
        name: `${PERMISSIONS_PREFIX.DELETE}USERS`
      },
    ];
    await connection.getRepository(tableName).save([...permissions], { chunk: 500 });
  }
}
