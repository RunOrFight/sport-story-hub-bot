import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFieldsForUsersAndSeedersTable1708211970881 implements MigrationInterface {
  name = "AddedFieldsForUsersAndSeedersTable1708211970881";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_9cadc932043b988738e4cdebd2"`);
    await queryRunner.query(`CREATE TABLE "seeders"
                             (
                                 "id"   SERIAL            NOT NULL,
                                 "name" character varying NOT NULL,
                                 CONSTRAINT "PK_c47f92b5ea524850088945b62cf" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "name" character varying`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "surname" character varying`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "wins" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "losses" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "draws" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "win_rate" double precision NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "total" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "goals" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "assists" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "elo" double precision NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "participants"
        ADD "goals" integer DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "participants"
        ADD "assists" integer DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "locations"
        ALTER COLUMN "address" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "events"
        ALTER COLUMN "price" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "status"`);
    await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('waiting', 'started', 'finished')`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "status" "public"."events_status_enum" DEFAULT 'waiting'`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_09c660ac18574bec8c56013ddb" ON "participants" ("user_id", "event_id") `);;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`);
    await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_09c660ac18574bec8c56013ddb"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "UQ_fccf31c64ec14a66276e9999730"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "status" character varying DEFAULT 'waiting'`);
    await queryRunner.query(`ALTER TABLE "events"
        ALTER COLUMN "price" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a367444399d0404c15d7dffdb02"`);
    await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "UQ_700e411e1f6f1395d5283b64b46"`);
    await queryRunner.query(`ALTER TABLE "locations"
        ALTER COLUMN "address" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "assists"`);
    await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "goals"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "elo"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "assists"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "goals"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "win_rate"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "draws"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "losses"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wins"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`DROP TABLE "seeders"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9cadc932043b988738e4cdebd2" ON "participants" ("user_id", "event_id") WHERE (user_id <> 1)`);
  }
}
