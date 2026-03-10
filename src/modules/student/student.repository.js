import { prisma } from '../../config/db.js';

export async function create({ parentId, name, email }) {
  return prisma.student.create({
    data: {
      parentId,
      name,
      email: email || null,
    },
  });
}

export async function findByParentId(parentId) {
  return prisma.student.findMany({
    where: { parentId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id) {
  return prisma.student.findUnique({
    where: { id },
  });
}

export async function findByIdAndParent(id, parentId) {
  return prisma.student.findFirst({
    where: { id, parentId },
  });
}
