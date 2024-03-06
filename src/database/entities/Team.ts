import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TeamParticipant } from "./TeamParticipant";
import { Event } from "./Event";
import { GameTeam } from "./GameTeam";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @ManyToOne(() => Event, { nullable: false })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @OneToMany(() => GameTeam, (gt) => gt.team, {
    onDelete: "CASCADE",
  })
  gameTeams!: GameTeam[];

  @OneToMany(() => TeamParticipant, (tp) => tp.team, {
    onDelete: "CASCADE",
  })
  teamsParticipants!: TeamParticipant[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
