import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EGameEventType } from "../../enums/game-event.enum";
import { Game } from "./Game";
import { TeamParticipant } from "./TeamParticipant";

@Entity("game_stats")
export class GameStat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    type: "enum",
    enum: EGameEventType,
  })
  type!: EGameEventType;

  @ManyToOne(() => Game, { nullable: false })
  @JoinColumn({ name: "game_id" })
  game!: Game;

  @ManyToOne(() => TeamParticipant, { nullable: false })
  @JoinColumn({ name: "team_participant_id" })
  teamParticipant!: TeamParticipant;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
