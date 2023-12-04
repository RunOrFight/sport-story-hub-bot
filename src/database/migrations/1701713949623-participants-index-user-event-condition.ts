import { MigrationInterface, QueryRunner } from "typeorm";

export class ParticipantsIndexUserEventCondition1701713949623 implements MigrationInterface {
    name = 'ParticipantsIndexUserEventCondition1701713949623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_09c660ac18574bec8c56013ddb"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9cadc932043b988738e4cdebd2" ON "participants" ("user_id", "event_id") WHERE (user_id <> 5)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DROP INDEX "public"."IDX_9cadc932043b988738e4cdebd2"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_09c660ac18574bec8c56013ddb" ON "participants" ("user_id", "event_id") `);
    }

}
