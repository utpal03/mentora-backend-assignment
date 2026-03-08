import bcrypt from 'bcrypt';
import * as parentRepository from './parent.repository.js';
import { generateToken } from '../../utils/auth.js';


function toResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function signup({ email, password, name }) {
  const existing = await parentRepository.findByEmail(email);
  if (existing) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await parentRepository.create({ email, passwordHash, name });
  const token = generateToken(user);
  return { token, user: toResponse(user) };
}

export async function login({ email, password }) {
  const user = await parentRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const token = generateToken(user);
  return { token, user: toResponse(user) };
}

export async function getProfile(id) {
  const user = await parentRepository.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return toResponse(user);
}
