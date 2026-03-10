import { prisma } from '../../config/db.js';

export async function create({ lessonId, date, topic, summary }) {
  return prisma.session.create({
    data: {
      lessonId,
      date: new Date(date),
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
