import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Game } from "./Game";
import { Team } from "./Team";

@Entity("game_teams")
@Index(["game", "team"], { unique: true })
export class GameTeam {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Game, { nullable: false })
  @JoinColumn({ name: "game_id" })
  game!: Game;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn({ name: "team_id" })
  team!: Team;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
