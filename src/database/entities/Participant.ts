import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, Index} from 'typeorm';
import {User} from "./User";
import {Event} from "./Event";

@Entity('participants')
@Index(['user', 'event'], {unique: true}) //  where: "(user_id <> user_id with username == player)"
export class Participant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({default: false})
    waitList!: boolean;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Event, {nullable: false})
    @JoinColumn({name: 'event_id'})
    event!: Event;

    @ManyToOne(() => Participant, {nullable: true})
    @JoinColumn({name: 'parent_participant_id'})
    parentParticipant?: Participant;
}
