import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { GameStat } from "./GameStat";
import { GameTeam } from "./GameTeam";

@Entity("games")
@Index(["name", "event"], { unique: true })
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @ManyToOne(() => Event, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @OneToMany(() => GameTeam, (gt) => gt.game)
  gameTeams!: GameTeam[];

  @OneToMany(() => GameStat, (gs) => gs.game)
  gameStats!: GameStat[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
