/*
  Warnings:

  - A unique constraint covering the columns `[userId,lpId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_lpId_key" ON "Like"("userId", "lpId");
