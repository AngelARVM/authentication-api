import { UserRoles } from 'src/common/catalogs/user-role.enum'
import { UserStatus } from 'src/common/catalogs/user-status.enum'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class User {
  @Column({ unique: true, primary: true, generated: true })
    id: number

  @Column({ unique: true })
    username: string

  @Column()
    password: string

  @Column({ unique: true })
    email: string

  @Column({ type: 'enum', enumName: 'UserStatus', nullable: true, enum: UserStatus })
    status?: UserStatus

  @Column({ type: 'enum', enumName: 'UserRoles', nullable: true, enum: UserRoles })
    role?: UserRoles

  @Column({ nullable: true })
    createdAt?: Date

  @Column({ nullable: true })
    updatedAt?: Date

  @Column({ nullable: true })
    deletedAt?: Date

  @Column({ nullable: true })
    createdBy?: string

  @Column({ nullable: true })
    updatedBy?: string

  @Column({ nullable: true })
    deletedBy?: string
}
