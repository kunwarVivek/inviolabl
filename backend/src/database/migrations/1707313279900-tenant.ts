import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1707313279900 implements MigrationInterface {
    name = 'Tenant1707313279900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying NOT NULL, "files_id" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "filesCid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, CONSTRAINT "UQ_a0d4405c5e633da9ab7704e9b19" UNIQUE ("email"), CONSTRAINT "PK_38caac33c8befc5c6d1264d4f0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cids" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cid" character varying NOT NULL, CONSTRAINT "UQ_731f19c697b2f8491ab81963bb4" UNIQUE ("cid"), CONSTRAINT "PK_7104bd33e70b2aa963eca1b57d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4" FOREIGN KEY ("files_id") REFERENCES "filesCid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_51b22a220fbbf73c816d114a2c4"`);
        await queryRunner.query(`DROP TABLE "cids"`);
        await queryRunner.query(`DROP TABLE "filesCid"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
