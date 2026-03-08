import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function generateToken(user) {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
