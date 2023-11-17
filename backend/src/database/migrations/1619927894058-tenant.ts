import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1619927894058 implements MigrationInterface {
    name = 'Tenant1619927894058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "tenants"
      (
        "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
        "name" character varying,
        "domain"  character varying,
        CONSTRAINT "PK_tenants_id" PRIMARY KEY ("id")

      )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "tenants"');
    }

}                
