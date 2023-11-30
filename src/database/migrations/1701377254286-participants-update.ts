import { MigrationInterface, QueryRunner } from "typeorm";

export class ParticipantsUpdate1701377254286 implements MigrationInterface {
    name = 'ParticipantsUpdate1701377254286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participants" ADD "waitList" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_09c660ac18574bec8c56013ddb" ON "participants" ("user_id", "event_id") `);
        await queryRunner.query(`ALTER TABLE "participants" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "participants" ALTER COLUMN "event_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "waitList"`);
        await queryRunner.query(`ALTER TABLE "participants" ALTER COLUMN "event_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "participants" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09c660ac18574bec8c56013ddb"`);
    }

}
