import * as authService from './auth.service.js';

export async function signup(req, res) {
  try {
    const { email, password, name, role } = req.body;
    const result = await authService.signup({ email, password, name, role });
    res.status(201).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await authService.getProfile(req.userId);
    res.json(user);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
}
