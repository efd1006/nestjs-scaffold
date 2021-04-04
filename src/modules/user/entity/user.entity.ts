import { classToPlain, Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAuthSessionEntity } from "../../auth/entity/user_auth_session.entity";
import { RoleEntity } from "../../role/entity/role.entity";

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
    unique: true
  })
  email: string

  @Exclude()
  @Column({
    type: 'text'
  })
  password: string

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true
  })
  role_id: number
  
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => UserAuthSessionEntity, session => session.user)
  auth_sessions: UserAuthSessionEntity[]

  @ManyToOne(() => RoleEntity, role => role.users)
  @JoinColumn({name: 'role_id', referencedColumnName: 'id'})
  role: RoleEntity

  toJSON() {
    return classToPlain(this);
  }

}