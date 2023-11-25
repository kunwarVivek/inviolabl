import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1700895072126 implements MigrationInterface {
    name = 'Tenant1700895072126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tenant_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tenant_id" DROP NOT NULL`);
    }

}
