import { MigrationInterface, QueryRunner } from "typeorm";

export class Ten1713965162126 implements MigrationInterface {
    name = 'Ten1713965162126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "count" ALTER COLUMN "shared_emails" DROP DEFAULT`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "count" ALTER COLUMN "shared_emails" SET DEFAULT '[]'`);
        
    }

}
