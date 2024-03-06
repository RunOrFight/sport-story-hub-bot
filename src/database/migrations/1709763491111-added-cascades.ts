import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCascades1709763491111 implements MigrationInterface {
  name = "AddedCascades1709763491111";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events"
        DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "description" text`);
    await queryRunner.query(`
        ALTER TABLE game_teams
            DROP CONSTRAINT "FK_3b9fd08a08f69566c3a9e834b10",
            ADD CONSTRAINT "FK_3b9fd08a08f69566c3a9e834b10" FOREIGN KEY (game_id)
                REFERENCES games (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE game_teams
            DROP CONSTRAINT "FK_c6dd34bbddab7dd9b6b3a13b34a",
            ADD CONSTRAINT "FK_c6dd34bbddab7dd9b6b3a13b34a" FOREIGN KEY (team_id)
                REFERENCES teams (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE team_participants
            DROP CONSTRAINT "FK_45a0b1789995b3c976864ef57b9",
            ADD CONSTRAINT "FK_45a0b1789995b3c976864ef57b9" FOREIGN KEY (participant_id)
                REFERENCES participants (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE team_participants
            DROP CONSTRAINT "FK_3104abd17877ba6cf1e9156ca3a",
            ADD CONSTRAINT "FK_3104abd17877ba6cf1e9156ca3a" FOREIGN KEY (team_id)
                REFERENCES teams (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE participants
            DROP CONSTRAINT "FK_1f663d2c0e63c2b9794b6b12802",
            ADD CONSTRAINT "FK_1f663d2c0e63c2b9794b6b12802" FOREIGN KEY (event_id)
                REFERENCES events (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE games
            DROP CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933",
            ADD CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933" FOREIGN KEY (event_id)
                REFERENCES events (id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
        ALTER TABLE teams
            DROP CONSTRAINT "FK_26d243fdc44c2b67e541b796a81",
            ADD CONSTRAINT "FK_26d243fdc44c2b67e541b796a81" FOREIGN KEY (event_id)
                REFERENCES events (id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events"
        DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "description" character varying`);
  }
}
