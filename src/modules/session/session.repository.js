import { prisma } from '../../config/db.js';

export async function create({ lessonId, date, topic, summary }) {
  return prisma.session.create({
    data: {
      lessonId,
      date,
      topic,
      summary,
    },
  });
}

export async function findByLessonId(lessonId) {
  return prisma.session.findMany({
    where: { lessonId },
    orderBy: { date: 'asc' },
  });
}

export async function findByIdWithLesson(id) {
  return prisma.session.findUnique({
    where: { id },
    include: {
      lesson: {
        select: { id: true, mentorId: true },
      },
    },
  });
}

export async function hasParentBookingForLesson(parentUserId, lessonId) {
  const booking = await prisma.booking.findFirst({
    where: {
      lessonId,
      studentUser: {
        asStudentRelations: {
          some: { parentUserId },
        },
      },
    },
    select: { id: true },
  });
  return Boolean(booking);
}

export async function hasStudentBookingForLesson(studentUserId, lessonId) {
  const booking = await prisma.booking.findUnique({
    where: {
      studentUserId_lessonId: { studentUserId, lessonId },
    },
    select: { id: true },
  });
  return Boolean(booking);
}
