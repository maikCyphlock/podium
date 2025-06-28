-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('ACTIVO', 'FINALIZADO', 'CANCELADO', 'POSTERGADO');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'ACTIVO';
