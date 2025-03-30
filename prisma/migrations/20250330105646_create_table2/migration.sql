-- CreateTable
CREATE TABLE "contacts_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "contacts_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_table_email_key" ON "contacts_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_table_phone_key" ON "contacts_table"("phone");
