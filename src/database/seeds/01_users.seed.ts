import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../shared/utils';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'users';

    let users = [
      {
        id: uuidv4(),
        email: 'user@mail.com',
        password: await hashPassword('password')
      },
    ];
    await connection.getRepository(tableName).save([...users], { chunk: 500 });
  }
}
