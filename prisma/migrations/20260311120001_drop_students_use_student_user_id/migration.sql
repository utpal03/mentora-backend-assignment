-- Remove old unique constraint and foreign key on bookings (student_id)
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_student_id_fkey";
DROP INDEX IF EXISTS "bookings_student_id_lesson_id_key";

-- Delete any bookings that were not backfilled (safety: only if you ran backfill script)
DELETE FROM "bookings" WHERE "student_user_id" IS NULL;

-- Make student_user_id required and drop student_id
ALTER TABLE "bookings" ALTER COLUMN "student_user_id" SET NOT NULL;
ALTER TABLE "bookings" DROP COLUMN "student_id";

-- New unique constraint
CREATE UNIQUE INDEX "bookings_student_user_id_lesson_id_key" ON "bookings"("student_user_id", "lesson_id");

-- Drop students table
DROP TABLE "students";
