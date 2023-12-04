import { MigrationInterface, QueryRunner } from "typeorm";

export class ParticipantsParentAdded1701708423931 implements MigrationInterface {
    name = 'ParticipantsParentAdded1701708423931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participants" ADD "parent_participant_id" integer`);
        await queryRunner.query(`ALTER TABLE "participants" ADD CONSTRAINT "FK_31c9288ba5e5448d7a7cfa3b853" FOREIGN KEY ("parent_participant_id") REFERENCES "participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participants" DROP CONSTRAINT "FK_31c9288ba5e5448d7a7cfa3b853"`);
        await queryRunner.query(`ALTER TABLE "participants" DROP COLUMN "parent_participant_id"`);
    }

}
