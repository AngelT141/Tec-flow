import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import { setAuthCookie, clearAuthCookie } from '../../lib/jwt.js';
import { requireAuth } from '../../middleware/auth.js';

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const { user, token } = await authService.register(data);
    setAuthCookie(res, token);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const { user, token } = await authService.login(data);
    setAuthCookie(res, token);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  clearAuthCookie(res);
  res.status(204).end();
}

export async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
