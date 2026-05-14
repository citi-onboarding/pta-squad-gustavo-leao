/*
  Warnings:

  - Added the required column `cover` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "cover" TEXT NOT NULL;
