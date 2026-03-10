import * as studentService from './student.service.js';

export async function create(req, res) {
  try {
    const { name, email } = req.body;
    const student = await studentService.createStudent(req.userId, { name, email });
    res.status(201).json(student);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function list(req, res) {
  try {
    const students = await studentService.listByParent(req.userId);
    res.json(students);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
