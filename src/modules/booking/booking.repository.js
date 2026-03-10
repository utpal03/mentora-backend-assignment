import { prisma } from '../../config/db.js';

export async function create({ studentId, lessonId }) {
  return prisma.booking.create({
    data: {
      studentId,
      lessonId,
    },
  });
}

export async function findStudentById(id) {
  return prisma.student.findUnique({
    where: { id },
  });
}

export async function findLessonById(id) {
  return prisma.lesson.findUnique({
    where: { id },
  });
}

export async function findExistingBooking(studentId, lessonId) {
  return prisma.booking.findUnique({
    where: {
      studentId_lessonId: { studentId, lessonId },
    },
  });
}
