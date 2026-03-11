import { prisma } from '../../config/db.js';

export async function create({ mentorId, title, description }) {
  return prisma.lesson.create({
    data: {
      mentorId,
      title,
      description,
    },
  });
}

export async function findById(id) {
  return prisma.lesson.findUnique({
    where: { id },
  });
}

export async function findByIdAndMentor(id, mentorId) {
  return prisma.lesson.findFirst({
    where: { id, mentorId },
  });
}

export async function findByMentorId(mentorId) {
  return prisma.lesson.findMany({
    where: { mentorId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findAll() {
  return prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
