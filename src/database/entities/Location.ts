import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { File } from "./File";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, type: "varchar" })
  title?: string | null;

  @Column({ nullable: true, type: "varchar" })
  url?: string | null;

  @Column({ nullable: true, type: "varchar" })
  address?: string | null;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: "file_id" })
  preview?: File | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
