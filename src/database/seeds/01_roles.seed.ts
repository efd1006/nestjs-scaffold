import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class SeedRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'roles';

    let roles = [
      {
        name: 'User'
      },
      {
        name: 'Admin'
      },
    ];
    await connection.getRepository(tableName).save([...roles], { chunk: 500 });
  }
}
