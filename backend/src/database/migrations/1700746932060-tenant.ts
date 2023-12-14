import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Tenant1700746932060 implements MigrationInterface {
  name = 'Tenant1700746932060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tenant_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP CONSTRAINT "UQ_32731f181236a46182a38c992a8"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "tenant_id" DROP NOT NULL`,
    );
  }
}
