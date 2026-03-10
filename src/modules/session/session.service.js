import * as sessionRepository from './session.repository.js';
import * as lessonRepository from '../lesson/lesson.repository.js';

export async function createSession(mentorId, { lessonId, date, topic, summary }) {
  if (lessonId == null || (typeof lessonId === 'string' && lessonId.trim() === '')) {
    const error = new Error('lessonId is required');
    error.statusCode = 400;
    throw error;
  }
  if (!date) {
    const error = new Error('date is required');
    error.statusCode = 400;
    throw error;
  }
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    const error = new Error('topic is required');
    error.statusCode = 400;
    throw error;
  }
  if (!summary || typeof summary !== 'string' || !summary.trim()) {
    const error = new Error('summary is required');
    error.statusCode = 400;
    throw error;
  }
  const lesson = await lessonRepository.findByIdAndMentor(Number(lessonId), mentorId);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    const error = new Error('Invalid date format');
    error.statusCode = 400;
    throw error;
  }
  return sessionRepository.create({
    lessonId: lesson.id,
    date: dateObj,
    topic: topic.trim(),
    summary: summary.trim(),
  });
}

export async function listByLessonId(lessonId) {
  const id = Number(lessonId);
  if (!id) {
    const error = new Error('Invalid lesson id');
    error.statusCode = 400;
    throw error;
  }
  return sessionRepository.findByLessonId(id);
}
