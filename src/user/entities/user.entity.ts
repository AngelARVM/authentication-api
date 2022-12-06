import { Column, Entity } from "typeorm";

@Entity('users')
export class User{
    @Column({unique: true, primary: true, generated: true})
    id: number

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @Column({unique: true})
    email: string
}