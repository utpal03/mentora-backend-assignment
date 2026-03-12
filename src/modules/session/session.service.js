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

export async function listByLessonId(userId, role, lessonId) {
  const id = Number(lessonId);
  if (!id) {
    const error = new Error('Invalid lesson id');
    error.statusCode = 400;
    throw error;
  }

  const lesson = await lessonRepository.findById(id);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }

  if (role === 'MENTOR') {
    if (lesson.mentorId !== userId) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }
  } else if (role === 'PARENT') {
    const hasBooking = await sessionRepository.hasParentBookingForLesson(userId, id);
    if (!hasBooking) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  } else if (role === 'STUDENT') {
    const hasBooking = await sessionRepository.hasStudentBookingForLesson(userId, id);
    if (!hasBooking) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  }

  return sessionRepository.findByLessonId(id);
}

export async function joinSession(userId, role, sessionId) {
  const id = Number(sessionId);
  if (!id) {
    const error = new Error('Invalid session id');
    error.statusCode = 400;
    throw error;
  }

  const session = await sessionRepository.findByIdWithLesson(id);
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (role === 'MENTOR') {
    if (session.lesson.mentorId !== userId) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  } else if (role === 'PARENT') {
    const hasBooking = await sessionRepository.hasParentBookingForLesson(userId, session.lessonId);
    if (!hasBooking) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  } else if (role === 'STUDENT') {
    const hasBooking = await sessionRepository.hasStudentBookingForLesson(userId, session.lessonId);
    if (!hasBooking) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  }

  return {
    message: 'Joined session successfully',
    session: {
      id: session.id,
      lessonId: session.lessonId,
      date: session.date,
      topic: session.topic,
      summary: session.summary,
    },
    joinedAt: new Date().toISOString(),
  };
}
