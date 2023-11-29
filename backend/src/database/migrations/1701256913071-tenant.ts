import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1701256913071 implements MigrationInterface {
    name = 'Tenant1701256913071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_name" character varying NOT NULL, "data" bytea NOT NULL, "uploaded_by" character varying NOT NULL, "domain_id" character varying NOT NULL, "file_size" integer NOT NULL, "email" character varying NOT NULL, "tenantId" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_269610c73dc40cbf3e07e689b25" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_269610c73dc40cbf3e07e689b25"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
