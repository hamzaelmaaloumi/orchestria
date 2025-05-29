/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `books_isbn_key` ON `books`(`isbn`);
