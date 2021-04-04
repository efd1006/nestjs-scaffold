import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity('user_auth_sessions')
export class UserAuthSessionEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'uuid'
  })
  user_id: string

  @Column({
    type: 'text'
  })
  access_token: string

  @Column({
    type: 'text'
  })
  refresh_token: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => UserEntity, user => user.auth_sessions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: UserEntity
}