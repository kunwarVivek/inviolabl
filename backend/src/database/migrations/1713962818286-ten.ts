import { MigrationInterface, QueryRunner } from "typeorm";

export class Ten1713962818286 implements MigrationInterface {
    name = 'Ten1713962818286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "count" ADD "shared_emails" text NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.query(`ALTER TABLE "count" DROP COLUMN "shared_emails"`);

    }

}
