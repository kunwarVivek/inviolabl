import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1707896595717 implements MigrationInterface {
    name = 'Tenant1707896595717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "gas_policy" character varying NOT NULL, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "created_at"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "updated_at"`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4"`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "files_id"`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD "files_id" character varying`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "id"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "id" character varying NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a" PRIMARY KEY ("id")`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4" FOREIGN KEY ("files_id") REFERENCES "filesCid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "id"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a" PRIMARY KEY ("id")`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "files_id"`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD "files_id" uuid`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4" FOREIGN KEY ("files_id") REFERENCES "filesCid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
