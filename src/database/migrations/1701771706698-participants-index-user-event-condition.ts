import { MigrationInterface, QueryRunner } from "typeorm";

export class ParticipantsIndexUserEventCondition1701771706698
  implements MigrationInterface
{
  name = "ParticipantsIndexUserEventCondition1701771706698";

  public async up(queryRunner: QueryRunner): Promise<void> {
    let playerUser = await queryRunner.query(
      `SELECT id FROM "users" WHERE username = 'player' LIMIT 1`,
    );

    if (!playerUser[0]?.id) {
      playerUser = await queryRunner.query(
        `INSERT INTO "users" (username) VALUES ('player') returning id`,
      );
    }

    if (!playerUser[0]?.id) {
      throw new Error("Error in migration, user was not found");
    }

    await queryRunner.query(
      `DROP INDEX "public"."IDX_09c660ac18574bec8c56013ddb"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9cadc932043b988738e4cdebd2" ON "participants" ("user_id", "event_id") WHERE (user_id <> ${playerUser[0]?.id})`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cadc932043b988738e4cdebd2"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_09c660ac18574bec8c56013ddb" ON "participants" ("user_id", "event_id") `,
    );
  }
}
