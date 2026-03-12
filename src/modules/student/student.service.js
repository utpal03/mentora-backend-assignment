import * as studentRepository from './student.repository.js';
import * as authRepository from '../auth/auth.repository.js';

function toStudentPayload(record) {
  const user = record.studentUser ?? record;
  return {
    id: user.id,
    email: user.email ?? null,
    name: user.name ?? null,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function createStudent(parentId, { name, email }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = name.trim();
  const normalizedEmail =
    email && String(email).trim()
      ? String(email).trim().toLowerCase()
      : `student-${parentId}-${Date.now()}@placeholder.mentora`;

  let user = await authRepository.findByEmail(normalizedEmail);
  if (user) {
    if (user.role !== 'STUDENT') {
      const error = new Error('This email is already registered');
      error.statusCode = 409;
      throw error;
    }
    const linkedElsewhere = await studentRepository.hasAnyParentLinkForStudent(user.id);
    if (linkedElsewhere) {
      const error = new Error('This student is already linked to another parent');
      error.statusCode = 409;
      throw error;
    }
  } else {
    user = await authRepository.createStudentUser({
      email: normalizedEmail,
      name: trimmedName,
    });
  }

  const existing = await studentRepository.findParentStudentLink(parentId, user.id);
  if (existing) {
    const error = new Error('This student is already linked to you');
    error.statusCode = 409;
    throw error;
  }

  await studentRepository.createParentStudentLink(parentId, user.id);
  return toStudentPayload({ studentUser: user });
}

export async function listByParent(parentId) {
  const links = await studentRepository.findStudentsByParentId(parentId);
  return links.map((link) => toStudentPayload(link));
}

export async function getStudentByIdAndParent(studentUserId, parentId) {
  const link = await studentRepository.findParentStudentLink(parentId, studentUserId);
  if (!link) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  const user = await studentRepository.findStudentUserById(studentUserId);
  if (!user) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return toStudentPayload({ studentUser: user });
}
