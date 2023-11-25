import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenant1700906013675 implements MigrationInterface {
    name = 'Tenant1700906013675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL`);
    }

}
