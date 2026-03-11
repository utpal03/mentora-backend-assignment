import { prisma } from '../../config/db.js';

export async function create({ studentUserId, lessonId }) {
  return prisma.booking.create({
    data: {
      studentUserId,
      lessonId,
    },
  });
}

export async function findStudentUserById(id) {
  return prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
    select: { id: true, role: true },
  });
}

export async function findLessonById(id) {
  return prisma.lesson.findUnique({
    where: { id },
  });
}

export async function findExistingBooking(studentUserId, lessonId) {
  return prisma.booking.findUnique({
    where: {
      studentUserId_lessonId: { studentUserId, lessonId },
    },
  });
}

export async function findParentStudentLink(parentUserId, studentUserId) {
  return prisma.parentStudent.findUnique({
    where: {
      parentUserId_studentUserId: { parentUserId, studentUserId },
    },
  });
}
