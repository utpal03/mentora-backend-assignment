import * as sessionService from './session.service.js';

export async function create(req, res) {
  try {
    const { lessonId, date, topic, summary } = req.body;
    const session = await sessionService.createSession(req.userId, {
      lessonId,
      date,
      topic,
      summary,
    });
    res.status(201).json(session);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function listByLessonId(req, res) {
  try {
    const sessions = await sessionService.listByLessonId(req.userId, req.role, req.params.id);
    res.json(sessions);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function join(req, res) {
  try {
    const result = await sessionService.joinSession(req.userId, req.role, req.params.id);
    res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
