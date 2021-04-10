import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../shared/utils';
import { RoleEntity } from '../../modules/role/entity/role.entity';

export default class SeedUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'users';


    const adminRole = await connection.getRepository(RoleEntity).findOne({where: {name: 'Admin'}})

    const userRole = await connection.getRepository(RoleEntity).findOne({where: {name: 'User'}})

    let users = [
      {
        id: uuidv4(),
        email: 'admin@mail.com',
        password: await hashPassword('password'),
        role_id: adminRole.id
      },
      {
        id: uuidv4(),
        email: 'user@mail.com',
        password: await hashPassword('password'),
        role_id: userRole.id
      },
    ];
    await connection.getRepository(tableName).save([...users], { chunk: 500 });
  }
}
