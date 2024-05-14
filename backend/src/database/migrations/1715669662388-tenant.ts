import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1715669662388 implements MigrationInterface {
    name = 'Tenant1715669662388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "created_at"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "count" ADD "filename" character varying`);
        await queryRunner.query(`ALTER TABLE "count" ADD "filesize" integer`);
        await queryRunner.query(`ALTER TABLE "count" ADD "filetype" character varying`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4"`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "files_id"`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD "files_id" character varying`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "id"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "id" character varying NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a" PRIMARY KEY ("id")`);
        // await queryRunner.query(`ALTER TABLE "count" ALTER COLUMN "email" SET NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4" FOREIGN KEY ("files_id") REFERENCES "filesCid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4"`);
        // await queryRunner.query(`ALTER TABLE "count" ALTER COLUMN "email" DROP NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" DROP COLUMN "id"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a" PRIMARY KEY ("id")`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "files_id"`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD "files_id" uuid`);
        // await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4" FOREIGN KEY ("files_id") REFERENCES "filesCid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "count" DROP COLUMN "filetype"`);
        await queryRunner.query(`ALTER TABLE "count" DROP COLUMN "filesize"`);
        await queryRunner.query(`ALTER TABLE "count" DROP COLUMN "filename"`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        // await queryRunner.query(`ALTER TABLE "filesCid" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
