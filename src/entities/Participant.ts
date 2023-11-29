import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne} from 'typeorm';
import {User} from "./User";
import {Event} from "./Event";

@Entity('participants')
export class Participant {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, {nullable: true})
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Event, {nullable: true})
    @JoinColumn({name: 'event_id'})
    event!: Event;
}
