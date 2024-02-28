import { MigrationInterface, QueryRunner } from "typeorm";

export class ParticipantUserOptional1709074791815
  implements MigrationInterface
{
  name = "ParticipantUserOptional1709074791815";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09c660ac18574bec8c56013ddb"`,
    );
    await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "goals"`);
    await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "assists"`);
    await queryRunner.query(
      `ALTER TABLE "participants" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d2bba172c957bd97571f872905" ON "participants" ("user_id", "event_id") WHERE (user_id IS NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "FK_1427a77e06023c250ed3794a1ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2bba172c957bd97571f872905"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "UQ_fccf31c64ec14a66276e9999730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "FK_1427a77e06023c250ed3794a1ba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "UQ_700e411e1f6f1395d5283b64b46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" ADD "assists" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" ADD "goals" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_09c660ac18574bec8c56013ddb" ON "participants" ("user_id", "event_id") `,
    );
  }
}
