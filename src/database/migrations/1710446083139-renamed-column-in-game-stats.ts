import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamedColumnInGameStats1710446083139
  implements MigrationInterface
{
  name = "RenamedColumnInGameStats1710446083139";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_stats" RENAME COLUMN "event" TO "type"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."game_stats_event_enum" RENAME TO "game_stats_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."game_stats_type_enum" RENAME TO "game_stats_event_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_stats" RENAME COLUMN "type" TO "event"`,
    );
  }
}
