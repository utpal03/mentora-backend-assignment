import bcrypt from 'bcrypt';
import * as authRepository from './auth.repository.js';
import { generateToken } from '../../utils/auth.js';

const SALT_ROUNDS = 10;
// All three roles are allowed to log in. NOTE: student can log in to see what are the lessons assigned to them.
// Students cannot sign up directly but can log in once created by a parent.
const ALLOWED_LOGIN_ROLES = ['PARENT', 'MENTOR', 'STUDENT'];

function toResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function signup({ email, password, name, role }) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password is required and must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  if (!role || !['PARENT', 'MENTOR'].includes(role)) {
    const error = new Error('Only parents and mentors can sign up. Role must be "PARENT" or "MENTOR".');
    error.statusCode = 400;
    throw error;
  }
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await authRepository.create({ email, passwordHash, name, role });
  const token = generateToken(user);
  return { token, user: toResponse(user) };
}

export async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }
  const user = await authRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Email is incorrect');
    error.statusCode = 401;
    throw error;
  }
  if (!ALLOWED_LOGIN_ROLES.includes(user.role)) {
    const error = new Error('Email is incorrect');
    error.statusCode = 401;
    throw error;
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Password is incorrect');
    error.statusCode = 401;
    throw error;
  }
  const token = generateToken(user);
  return { token, user: toResponse(user) };
}

export async function getProfile(id) {
  const user = await authRepository.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return toResponse(user);
}
