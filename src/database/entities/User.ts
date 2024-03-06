import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { File } from "./File";
import { EUserRole } from "../../enums/user-role.enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ nullable: true, type: "varchar" })
  public name?: string | null;

  @Column({ nullable: true, type: "varchar" })
  public surname?: string | null;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: "file_id" })
  photo?: File | null;

  @Column({ nullable: false, default: 0 })
  wins: number = 0;

  @Column({ nullable: false, default: 0 })
  losses: number = 0;

  @Column({ nullable: false, default: 0 })
  draws: number = 0;

  @Column({ nullable: false, default: 0, name: "win_rate", type: "float" })
  winRate: number = 0;

  @Column({ nullable: false, default: 0 })
  total: number = 0;

  @Column({ nullable: false, default: 0 })
  goals: number = 0;

  @Column({ nullable: false, default: 0 })
  assists: number = 0;

  @Column({ nullable: false, default: 0, name: "elo", type: "float" })
  Elo: number = 0;

  @Column("enum", {
    nullable: false,
    array: true,
    enum: EUserRole,
    default: [EUserRole.USER],
  })
  roles!: EUserRole[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateWinRateAndTotal() {
    this.total = this.wins + this.losses + this.draws;

    if (this.wins || this.losses) {
      this.winRate = this.wins / (this.wins + this.losses);
    } else {
      this.winRate = 0;
    }
  }
}
