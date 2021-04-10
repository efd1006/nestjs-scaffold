import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class PermissionEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
    unique: true
  })
  name: string

  @BeforeInsert()
  async beforeInsertHook() {
    this.name = this.name.toUpperCase()
  }

}