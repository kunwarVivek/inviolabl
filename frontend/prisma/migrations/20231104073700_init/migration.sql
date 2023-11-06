-- CreateTable
CREATE TABLE "Tenants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenants_domain_key" ON "Tenants"("domain");
