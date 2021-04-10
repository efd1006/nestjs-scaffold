import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "../../permission/entity/permission.entity";
import { UserEntity } from "../../user/entity/user.entity";

@Entity('roles')
export class RoleEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
    unique: true
  })
  name: string

  @OneToMany(() => UserEntity, user => user.role)
  users: UserEntity[]

  @ManyToMany(() => PermissionEntity, { cascade: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
  })
  permissions: PermissionEntity[]

}