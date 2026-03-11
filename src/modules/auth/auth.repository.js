import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';

const SALT_ROUNDS = 10;

function getDefaultStudentPassword() {
  const value = process.env.DEFAULT_STUDENT_PASSWORD;
  if (!value || typeof value !== 'string' || !value.trim()) {
    const error = new Error('DEFAULT_STUDENT_PASSWORD is not configured. Set it in .env.');
    error.statusCode = 500;
    throw error;
  }
  return value;
}

// Only parents and mentors can be created via the public signup endpoint.
const ALLOWED_SIGNUP_ROLES = ['PARENT', 'MENTOR'];

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

// Students cannot sign up themselves; each gets the default password.
export async function createStudentUser({ email, name }) {
  const defaultPassword = getDefaultStudentPassword();
  const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: name || 'Mentora-student',
      role: 'STUDENT',
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
