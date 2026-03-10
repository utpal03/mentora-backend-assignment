import * as studentRepository from './student.repository.js';

export async function createStudent(parentId, { name, email }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    throw error;
  }
  return studentRepository.create({
    parentId,
    name: name.trim(),
    email: email ? String(email).trim() || null : null,
  });
}

export async function listByParent(parentId) {
  return studentRepository.findByParentId(parentId);
}

export async function getStudentByIdAndParent(id, parentId) {
  const student = await studentRepository.findByIdAndParent(id, parentId);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
}
