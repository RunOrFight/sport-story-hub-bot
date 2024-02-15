import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {EEventStatus} from "../../enums/EventStatus";
import {Location} from "./Location";
import {Participant} from "./Participant";

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'timestamp', nullable: true, name: 'date_time'})
    dateTime!: Date;

    @Column({})
    price!: string;

    @Column({nullable: true, default: EEventStatus.WAITING})
    status!: EEventStatus;

    @Column({nullable: true})
    participantsLimit?: number;

    @Column({nullable: true})
    description?: string;

    @OneToOne(() => Location)
    @JoinColumn({name: 'location_id'})
    location!: Location;

    @OneToMany(() => Participant, participant => participant.event)
    participants!: Participant[];
}
