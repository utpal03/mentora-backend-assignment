import { prisma } from '../../config/db.js';

export async function createParentStudentLink(parentUserId, studentUserId) {
  return prisma.parentStudent.create({
    data: {
      parentUserId,
      studentUserId,
    },
  });
}

export async function findStudentsByParentId(parentUserId) {
  return prisma.parentStudent.findMany({
    where: { parentUserId },
    orderBy: { createdAt: 'desc' },
    include: {
      studentUser: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function findStudentUserById(id) {
  return prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
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

export async function hasAnyParentLinkForStudent(studentUserId) {
  const existing = await prisma.parentStudent.findFirst({
    where: { studentUserId },
    select: { id: true },
  });
  return Boolean(existing);
}
