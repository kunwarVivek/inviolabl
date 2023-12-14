// import { MigrationInterface, QueryRunner } from "typeorm";

// export class Tenant1701256548269 implements MigrationInterface {
//     name = 'Tenant1701256548269'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query('ALTER TABLE "tenants" DROP CONSTRAINT "UQ_155c343439adc83ada6ee3f48be"');
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query('ALTER TABLE "tenants" ADD CONSTRAINT "UQ_155c343439adc83ada6ee3f48be" UNIQUE ("email")');

//     }

// }
