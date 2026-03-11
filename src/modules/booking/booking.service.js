import * as bookingRepository from './booking.repository.js';

export async function createBooking(parentId, { studentId, lessonId }) {
  const studentUserId = Number(studentId);
  const lid = Number(lessonId);
  if (!studentUserId || !lid) {
    const error = new Error('studentId and lessonId are required');
    error.statusCode = 400;
    throw error;
  }
  const studentUser = await bookingRepository.findStudentUserById(studentUserId);
  if (!studentUser) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  const link = await bookingRepository.findParentStudentLink(parentId, studentUserId);
  if (!link) {
    const error = new Error('Forbidden: student does not belong to you');
    error.statusCode = 403;
    throw error;
  }
  const lesson = await bookingRepository.findLessonById(lid);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }
  const existing = await bookingRepository.findExistingBooking(studentUserId, lid);
  if (existing) {
    const error = new Error('Student is already booked for this lesson');
    error.statusCode = 409;
    throw error;
  }
  return bookingRepository.create({ studentUserId, lessonId: lid });
}
