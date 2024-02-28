import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
  AfterRemove,
  AfterInsert,
} from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { TeamParticipant } from "./TeamParticipant";
import db from "../";

@Entity("participants")
@Index(["user", "event"], { unique: true, where: "(user_id IS NOT NULL)" })
export class Participant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  waitList!: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User | null;

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

  @BeforeInsert()
  async waitListWhenUserJoined() {
    try {
      if (this.event.participantsLimit) {
        if (this.event.participants.length >= this.event.participantsLimit!) {
          this.waitList = true;
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @AfterRemove()
  async waitListWhenUserLeft() {
    try {
      if (!this.waitList) {
        const waitListParticipants = await db.getRepository(Participant).find({
          relations: { event: true },
          where: { event: { id: this.event.id }, waitList: true },
          order: { id: "ASC" },
        });
        if (waitListParticipants.length) {
          const participant = await db
            .getRepository(Participant)
            .findOne({ where: { id: waitListParticipants[0].id } });
          console.log(participant, "WAIT LIST PART");
          participant!.waitList = false;
          await db.getRepository(Participant).save(participant!);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
