/*
  Warnings:

  - Made the column `requestDate` on table `borrow_books` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `borrow_books` ADD COLUMN `borrowDate` DATETIME(3) NULL,
    MODIFY `requestDate` DATETIME(3) NOT NULL;
