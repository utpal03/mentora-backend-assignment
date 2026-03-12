-- Normalize Role enum values to uppercase to match Prisma schema/application code.
ALTER TYPE "Role" RENAME VALUE 'parent' TO 'PARENT';
ALTER TYPE "Role" RENAME VALUE 'mentor' TO 'MENTOR';
ALTER TYPE "Role" RENAME VALUE 'student' TO 'STUDENT';
