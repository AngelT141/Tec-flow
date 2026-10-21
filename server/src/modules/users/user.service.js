import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { notFound, badRequest } from '../../lib/errors.js';

const PUBLIC_USER = { id: true, name: true, email: true, role: true, active: true, createdAt: true };

export async function listUsers(query) {
  const where = {
    ...(query.role && { role: query.role }),
    ...(query.active !== undefined && { active: query.active === 'true' }),
    ...(query.q && {
      OR: [
        { name: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } },
      ],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: PUBLIC_USER,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page: query.page, pageSize: query.pageSize };
}

export async function createUser(input) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
    select: PUBLIC_USER,
  });
}

export async function updateUser(id, input) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFound('Usuario no encontrado');

  return prisma.user.update({
    where: { id },
    data: input,
    select: PUBLIC_USER,
  });
}

export async function toggleUser(currentUser, id) {
  if (id === currentUser.id) {
    throw badRequest('No puedes desactivar tu propia cuenta');
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFound('Usuario no encontrado');

  return prisma.user.update({
    where: { id },
    data: { active: !user.active },
    select: PUBLIC_USER,
  });
}
