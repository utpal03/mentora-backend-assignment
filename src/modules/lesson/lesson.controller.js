import * as lessonService from './lesson.service.js';

export async function create(req, res) {
  try {
    const { title, description } = req.body;
    const lesson = await lessonService.createLesson(req.userId, { title, description });
    res.status(201).json(lesson);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function listForCurrentMentor(req, res) {
  try {
    const lessons = await lessonService.listByMentor(req.userId);
    res.json(lessons);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const lesson = await lessonService.getLessonByIdAndMentor(
      Number(req.params.id),
      req.userId
    );
    res.json(lesson);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
