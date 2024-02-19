import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSubEntitiesForEvent1708290625796
  implements MigrationInterface
{
  name = "AddedSubEntitiesForEvent1708290625796";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."game_stats_event_enum" AS ENUM('goal', 'assist')`,
    );
    await queryRunner.query(`CREATE TABLE "game_stats"
                             (
                                 "id"                  SERIAL                            NOT NULL,
                                 "event"              "public"."game_stats_event_enum" NOT NULL,
                                 "created_at"          TIMESTAMP                         NOT NULL DEFAULT now(),
                                 "updated_at"          TIMESTAMP                         NOT NULL DEFAULT now(),
                                 "game_id"             integer                           NOT NULL,
                                 "team_participant_id" integer                           NOT NULL,
                                 CONSTRAINT "PK_289bd8cd7cadaeb5f3f75746196" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "games"
                             (
                                 "id"         SERIAL            NOT NULL,
                                 "name"       character varying NOT NULL,
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "event_id"   integer           NOT NULL,
                                 CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e37c4c4c957c5c04d1bdb471f2" ON "games" ("name", "event_id") `,
    );
    await queryRunner.query(`CREATE TABLE "game_teams"
                             (
                                 "id"         SERIAL    NOT NULL,
                                 "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                                 "game_id"    integer   NOT NULL,
                                 "team_id"    integer   NOT NULL,
                                 CONSTRAINT "PK_e65b2d153b104c1d89cbba08057" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_59e18bcfb2f9cf74c8d2e1ae18" ON "game_teams" ("game_id", "team_id") `,
    );
    await queryRunner.query(`CREATE TABLE "teams"
                             (
                                 "id"         SERIAL            NOT NULL,
                                 "name"       character varying NOT NULL,
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "event_id"   integer           NOT NULL,
                                 CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "team_participants"
                             (
                                 "id"             SERIAL            NOT NULL,
                                 "team_id"        integer           NOT NULL,
                                 "participant_id" integer           NOT NULL,
                                 CONSTRAINT "PK_6070b57825ce5777271755cec36" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe55d9774b74f0efba8b2faafa" ON "team_participants" ("team_id", "participant_id") `,
    );
    await queryRunner.query(`ALTER TABLE "locations"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "locations"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "participants"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "participants"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "locations"
        DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`);
    await queryRunner.query(`ALTER TABLE "users"
        DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`);
    await queryRunner.query(`ALTER TABLE "events"
        DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`);
    await queryRunner.query(`ALTER TABLE "locations"
        ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "game_stats"
        ADD CONSTRAINT "FK_a8e2b0df27f8baa40c5aef8d3e3" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "game_stats"
        ADD CONSTRAINT "FK_e15c7781ec90a7f40b82302e467" FOREIGN KEY ("team_participant_id") REFERENCES "team_participants" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "games"
        ADD CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "game_teams"
        ADD CONSTRAINT "FK_3b9fd08a08f69566c3a9e834b10" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "game_teams"
        ADD CONSTRAINT "FK_c6dd34bbddab7dd9b6b3a13b34a" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "teams"
        ADD CONSTRAINT "FK_26d243fdc44c2b67e541b796a81" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "team_participants"
        ADD CONSTRAINT "FK_3104abd17877ba6cf1e9156ca3a" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "team_participants"
        ADD CONSTRAINT "FK_45a0b1789995b3c976864ef57b9" FOREIGN KEY ("participant_id") REFERENCES "participants" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events"
        DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`);
    await queryRunner.query(`ALTER TABLE "team_participants"
        DROP CONSTRAINT "FK_45a0b1789995b3c976864ef57b9"`);
    await queryRunner.query(`ALTER TABLE "team_participants"
        DROP CONSTRAINT "FK_3104abd17877ba6cf1e9156ca3a"`);
    await queryRunner.query(`ALTER TABLE "teams"
        DROP CONSTRAINT "FK_26d243fdc44c2b67e541b796a81"`);
    await queryRunner.query(`ALTER TABLE "game_teams"
        DROP CONSTRAINT "FK_c6dd34bbddab7dd9b6b3a13b34a"`);
    await queryRunner.query(`ALTER TABLE "game_teams"
        DROP CONSTRAINT "FK_3b9fd08a08f69566c3a9e834b10"`);
    await queryRunner.query(`ALTER TABLE "games"
        DROP CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933"`);
    await queryRunner.query(`ALTER TABLE "game_stats"
        DROP CONSTRAINT "FK_e15c7781ec90a7f40b82302e467"`);
    await queryRunner.query(`ALTER TABLE "game_stats"
        DROP CONSTRAINT "FK_a8e2b0df27f8baa40c5aef8d3e3"`);
    await queryRunner.query(`ALTER TABLE "users"
        DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`);
    await queryRunner.query(`ALTER TABLE "locations"
        DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`);
    await queryRunner.query(`ALTER TABLE "events"
        ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "locations"
        ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "events"
        DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "events"
        DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "participants"
        DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "participants"
        DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "locations"
        DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "locations"
        DROP COLUMN "created_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe55d9774b74f0efba8b2faafa"`,
    );
    await queryRunner.query(`DROP TABLE "team_participants"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59e18bcfb2f9cf74c8d2e1ae18"`,
    );
    await queryRunner.query(`DROP TABLE "game_teams"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e37c4c4c957c5c04d1bdb471f2"`,
    );
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "game_stats"`);
    await queryRunner.query(`DROP TYPE "public"."game_stats_event_enum"`);
  }
}
