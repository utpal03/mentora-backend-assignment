import { prisma } from '../../config/db.js';

const ALLOWED_SIGNUP_ROLES = ['parent', 'mentor'];

export async function findByEmail(email, role = null) {
  const where = { email: email.toLowerCase() };
  if (role) where.role = role;
  return prisma.user.findFirst({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
      createdAt: true,
    },
  });
}

export async function findById(id) {
  return prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function create({ email, passwordHash, name, role }) {
  if (!ALLOWED_SIGNUP_ROLES.includes(role)) {
    const error = new Error('Invalid role for signup');
    error.statusCode = 400;
    throw error;
  }
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: name || null,
      role,
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
