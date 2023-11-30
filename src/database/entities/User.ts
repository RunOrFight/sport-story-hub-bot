import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne} from 'typeorm';
import {File} from "./File";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @OneToOne(() => File, {nullable: true})
    @JoinColumn({ name: 'file_id'})
    photo?: File;
}
