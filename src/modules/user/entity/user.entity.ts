import { classToPlain, Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAuthSessionEntity } from "../../auth/entity/user_auth_session.entity";

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
  
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => UserAuthSessionEntity, session => session.user)
  auth_sessions: UserAuthSessionEntity[]

  toJSON() {
    return classToPlain(this);
  }

}