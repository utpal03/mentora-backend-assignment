-- CreateTable
CREATE TABLE "parent_students" (
    "id" SERIAL NOT NULL,
    "parent_user_id" INTEGER NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_students_pkey" PRIMARY KEY ("id")
);

-- AddColumn: bookings.student_user_id (nullable until backfill runs)
ALTER TABLE "bookings" ADD COLUMN "student_user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "parent_students_parent_user_id_student_user_id_key" ON "parent_students"("parent_user_id", "student_user_id");

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parent_user_id_fkey" FOREIGN KEY ("parent_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (nullable for now; backfill script will populate, then next migration makes it NOT NULL)
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
