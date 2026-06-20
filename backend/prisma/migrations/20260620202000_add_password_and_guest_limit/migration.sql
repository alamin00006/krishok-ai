-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "guestId" TEXT;

-- CreateIndex
CREATE INDEX "Question_guestId_createdAt_idx" ON "Question"("guestId", "createdAt");
