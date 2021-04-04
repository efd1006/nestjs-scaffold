import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
    unique: true
  })
  email: string

  @Column({
    type: 'text'
  })
  password: string
  
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

}