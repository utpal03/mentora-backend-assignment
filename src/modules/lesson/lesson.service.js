import * as lessonRepository from './lesson.repository.js';

export async function createLesson(mentorId, { title, description }) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('Title is required');
    error.statusCode = 400;
    throw error;
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    const error = new Error('Description is required');
    error.statusCode = 400;
    throw error;
  }
  return lessonRepository.create({
    mentorId,
    title: title.trim(),
    description: description.trim(),
  });
}

export async function getLessonById(id) {
  const lesson = await lessonRepository.findById(id);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }
  return lesson;
}

export async function getLessonByIdAndMentor(id, mentorId) {
  const lesson = await lessonRepository.findByIdAndMentor(id, mentorId);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }
  return lesson;
}

export async function listByMentor(mentorId) {
  return lessonRepository.findByMentorId(mentorId);
}
