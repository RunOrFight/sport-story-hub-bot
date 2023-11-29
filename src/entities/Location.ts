import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {File} from "./File";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    title?: string;

    @Column({nullable: true})
    url?: string;

    @Column()
    address!: string;

    @OneToOne(() => File, {nullable: true})
    @JoinColumn({ name: 'file_id'})
    preview?: File[];

}
