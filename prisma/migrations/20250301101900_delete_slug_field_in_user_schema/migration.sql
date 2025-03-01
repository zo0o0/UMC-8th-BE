/*
  Warnings:

  - You are about to drop the column `slug` on the `Lp` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "published" BOOLEAN NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lp_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lp" ("authorId", "content", "createdAt", "id", "published", "thumbnail", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "published", "thumbnail", "title", "updatedAt" FROM "Lp";
DROP TABLE "Lp";
ALTER TABLE "new_Lp" RENAME TO "Lp";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
