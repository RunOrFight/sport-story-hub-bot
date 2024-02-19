import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Participant } from "./Participant";
import { GameStat } from "./GameStat";
import { Team } from "./Team";

@Entity("team_participants")
@Index(["team", "participant"], { unique: true })
export class TeamParticipant {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn({ name: "team_id" })
  team!: Team;

  @ManyToOne(() => Participant, { nullable: false })
  @JoinColumn({ name: "participant_id" })
  participant!: Participant;

  @OneToMany(() => GameStat, (gs) => gs.teamParticipant)
  gameStats!: GameStat[];
}
