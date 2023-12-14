import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Tenant1700740857993 implements MigrationInterface {
  name = 'Tenant1700740857993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_19f4e08665a1f4bbbb7d5631f35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_tenants_tenant_id"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_translations_language_code_enum" AS ENUM('en_US', 'ru_RU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language_code" "public"."post_translations_language_code_enum" NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_977f23a9a89bf4a1a9e2e29c136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tenant_id" uuid NOT NULL, CONSTRAINT "REL_a6abc1c3ed0df635955fc852f1" UNIQUE ("tenant_id"), CONSTRAINT "PK_69225c0ca64bcbbf9af8a217043" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD "email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD CONSTRAINT "UQ_155c343439adc83ada6ee3f48be" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD "phone" character varying`,
    );
    // await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tenant_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD CONSTRAINT "UQ_da4054294eaae43ec7f85b6a3a1" UNIQUE ("domain")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" ADD CONSTRAINT "FK_11f143c8b50a9ff60340edca475" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_settings" ADD CONSTRAINT "FK_a6abc1c3ed0df635955fc852f1c" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenant_settings" DROP CONSTRAINT "FK_a6abc1c3ed0df635955fc852f1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" DROP CONSTRAINT "FK_11f143c8b50a9ff60340edca475"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP CONSTRAINT "UQ_da4054294eaae43ec7f85b6a3a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP CONSTRAINT "UQ_32731f181236a46182a38c992a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "tenant_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP CONSTRAINT "UQ_155c343439adc83ada6ee3f48be"`,
    );
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "email"`);
    await queryRunner.query(`DROP TABLE "tenant_settings"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "post_translations"`);
    await queryRunner.query(
      `DROP TYPE "public"."post_translations_language_code_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_tenants_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_19f4e08665a1f4bbbb7d5631f35" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
