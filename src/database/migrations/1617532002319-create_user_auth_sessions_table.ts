import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserAuthSessionsTable1617532002319 implements MigrationInterface {
    name = 'createUserAuthSessionsTable1617532002319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_auth_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_79bd169d1dce6477e021508189b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_auth_sessions" ADD CONSTRAINT "FK_ca176d084cdae42ad482e139c51" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_sessions" DROP CONSTRAINT "FK_ca176d084cdae42ad482e139c51"`);
        await queryRunner.query(`DROP TABLE "user_auth_sessions"`);
    }

}
