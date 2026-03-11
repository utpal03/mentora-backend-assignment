import * as lessonService from './lesson.service.js';

export async function create(req, res) {
  try {
    const { mentorId, title, description } = req.body;
    const lesson = await lessonService.createLesson(req.userId, {
      mentorId,
      title,
      description,
    });
    res.status(201).json(lesson);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function listForCurrentMentor(req, res) {
  try {
    const lessons =
      req.role === 'MENTOR'
        ? await lessonService.listByMentor(req.userId)
        : await lessonService.listAll();
    res.json(lessons);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);
    const lesson =
      req.role === 'MENTOR'
        ? await lessonService.getLessonByIdAndMentor(id, req.userId)
        : await lessonService.getLessonById(id);
    res.json(lesson);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
