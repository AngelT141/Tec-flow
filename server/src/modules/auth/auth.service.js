import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { signToken } from '../../lib/jwt.js';
import { conflict, unauthorized } from '../../lib/errors.js';

const publicUser = { id: true, name: true, email: true, role: true, active: true };

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw conflict('El correo ya está registrado');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'USER' },
    select: publicUser,
  });

  return { user, token: signToken(user) };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw unauthorized('Credenciales incorrectas');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw unauthorized('Credenciales incorrectas');

  if (!user.active) throw unauthorized('Cuenta desactivada');

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active };
  return { user: safeUser, token: signToken(safeUser) };
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser });
  return user;
}
