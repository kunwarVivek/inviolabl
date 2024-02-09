import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1707466221619 implements MigrationInterface {
    name = 'Tenant1707466221619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "count" ("id" SERIAL NOT NULL, "cid" character varying NOT NULL, "views" integer NOT NULL DEFAULT '0', "downloads" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_64d8bf139274fe6d6db3affcb93" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "count"`);
    }

}
