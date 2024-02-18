import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("seeders")
export class Seeder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}
