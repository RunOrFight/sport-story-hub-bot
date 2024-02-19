import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { TeamParticipant } from "./TeamParticipant";
import { Team } from "./Team";

@Entity("participants")
@Index(["user", "event"], { unique: true })
export class Participant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  waitList!: boolean;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Event, { nullable: false })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => Participant, { nullable: true })
  @JoinColumn({ name: "parent_participant_id" })
  parentParticipant?: Participant;

  @OneToMany(() => TeamParticipant, (tp) => tp.participant)
  teamsParticipants!: TeamParticipant[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
