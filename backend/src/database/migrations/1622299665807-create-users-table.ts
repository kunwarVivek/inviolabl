import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1622299665807 implements MigrationInterface {
    name = 'CreateUsersTable1622299665807';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the enum type 'users_role_enum' already exists
        const enumExistsResult = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM pg_type WHERE typname = 'users_role_enum'
            );
        `);
        const enumExists = enumExistsResult[0].exists;

        // If it does not exist, create it
        if (!enumExists) {
            await queryRunner.query(`
                CREATE TYPE "users_role_enum" AS ENUM('USER', 'ADMIN');
            `);
        }

        // Check if the 'users' table already exists
        const tableExistsResult = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);
        const tableExists = tableExistsResult[0].exists;

        // If it does not exist, create it along with the tenant_id foreign key
        if (!tableExists) {
            await queryRunner.query(`
                CREATE TABLE "users" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                    "first_name" character varying,
                    "last_name" character varying,
                    "role" "users_role_enum" NOT NULL DEFAULT 'USER',
                    "email" character varying,
                    "password" character varying,
                    "avatar" character varying,
                    "provider" character varying,
                    "username" character varying,
                    "name" character varying,
                    "tenant_id" uuid,
                    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
                    CONSTRAINT "FK_users_tenants_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL
                )
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if the 'users' table exists before dropping it
        const tableExistsResult = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);
        const tableExists = tableExistsResult[0].exists;

        if (tableExists) {
            await queryRunner.query('DROP TABLE "users"');
        }

        // Check if the enum type 'users_role_enum' exists before dropping it
        const enumExistsResult = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM pg_type WHERE typname = 'users_role_enum'
            );
        `);
        const enumExists = enumExistsResult[0].exists;

        if (enumExists) {
            await queryRunner.query('DROP TYPE "users_role_enum"');
        }
    }
}
