import { MigrationInterface, QueryRunner } from "typeorm";

export class Ten1713784723111 implements MigrationInterface {
    name = 'Ten1713784723111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "count" ADD "email" character varying`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "count" DROP COLUMN "email"`);
        
    }

}
