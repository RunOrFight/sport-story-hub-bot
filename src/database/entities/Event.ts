import {
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EEventStatus } from "../../enums/event-status.enum";
import { Location } from "./Location";
import { Participant } from "./Participant";
import { Game } from "./Game";
import { Team } from "./Team";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp", nullable: true, name: "date_time" })
  dateTime?: Date;

  @Column({ nullable: true })
  price?: string;

  @Column({
    nullable: true,
    default: EEventStatus.WAITING,
    type: "enum",
    enum: EEventStatus,
  })
  status?: EEventStatus;

  @Column({ nullable: true })
  participantsLimit?: number;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location?: Location;

  @OneToMany(() => Participant, (participant) => participant.event)
  participants!: Participant[];

  @OneToMany(() => Game, (game) => game.event)
  games!: Game[];

  @OneToMany(() => Team, (team) => team.event)
  teams!: Team[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
