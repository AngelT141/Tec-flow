import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  const agentHash = await bcrypt.hash('Agente1234!', 10);
  const userHash = await bcrypt.hash('Usuario1234!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tecflow.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@tecflow.com', passwordHash: adminHash, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'agente@tecflow.com' },
    update: {},
    create: { name: 'Agente Demo', email: 'agente@tecflow.com', passwordHash: agentHash, role: 'AGENT' },
  });

  await prisma.user.upsert({
    where: { email: 'usuario@tecflow.com' },
    update: {},
    create: { name: 'Usuario Demo', email: 'usuario@tecflow.com', passwordHash: userHash, role: 'USER' },
  });

  for (const name of ['Hardware', 'Software', 'Redes', 'Mantenimiento']) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  await prisma.counter.upsert({
    where: { name: 'ticket_number' },
    update: {},
    create: { name: 'ticket_number', value: 0 },
  });
}

main()
  .then(() => console.log('Seed completado'))
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
