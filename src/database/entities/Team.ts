import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Location} from "./Location";
import {Participant} from "./Participant";
import {Event} from "./Event";

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false})
    name!: string;

    @OneToOne(() => Location)
    @JoinColumn({name: 'location_id'})
    event!: Event;

    @ManyToMany(() => Participant)
    @JoinTable()
    participants: Participant[]
}
