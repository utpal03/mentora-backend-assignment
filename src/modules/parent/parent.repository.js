import { prisma } from '../../config/db.js';

const ROLE = 'parent';

export async function findByEmail(email) {
  return prisma.user.findFirst({
    where: { email: email.toLowerCase(), role: ROLE },
  });
}

export async function findById(id) {
  return prisma.user.findFirst({
    where: { id, role: ROLE },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function create({ email, passwordHash, name }) {
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: name || null,
      role: ROLE,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}
