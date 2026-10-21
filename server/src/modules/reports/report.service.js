import { prisma } from '../../lib/prisma.js';

function rangoFecha(from, to) {
  if (!from && !to) return undefined;
  return {
    ...(from && { gte: from }),
    ...(to && { lte: to }),
  };
}

function mapaConteos(grupos, campo) {
  const mapa = {};
  for (const grupo of grupos) {
    mapa[grupo[campo]] = grupo._count._all;
  }
  return mapa;
}

function promedioHoras(tickets) {
  if (tickets.length === 0) return 0;
  const totalMs = tickets.reduce(
    (acc, t) => acc + (new Date(t.closedAt).getTime() - new Date(t.createdAt).getTime()),
    0
  );
  return Math.round((totalMs / tickets.length / 3600000) * 100) / 100;
}

export async function summary({ from, to }) {
  const creadosEnRango = rangoFecha(from, to);
  const where = creadosEnRango ? { createdAt: creadosEnRango } : {};

  const [porEstado, porTipo, porPrioridad, total, cerrados] = await Promise.all([
    prisma.ticket.groupBy({ by: ['status'], where, _count: { _all: true } }),
    prisma.ticket.groupBy({ by: ['type'], where, _count: { _all: true } }),
    prisma.ticket.groupBy({ by: ['priority'], where, _count: { _all: true } }),
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where: {
        status: 'CLOSED',
        closedAt: creadosEnRango ?? { not: null },
      },
      select: { createdAt: true, closedAt: true },
    }),
  ]);

  return {
    rango: { from: from ?? null, to: to ?? null },
    total,
    porEstado: mapaConteos(porEstado, 'status'),
    porTipo: mapaConteos(porTipo, 'type'),
    porPrioridad: mapaConteos(porPrioridad, 'priority'),
    resueltosEnPeriodo: cerrados.length,
    tiempoPromedioResolucionHoras: promedioHoras(cerrados),
  };
}

export async function metricasAgente(userId) {
  const tickets = await prisma.ticket.findMany({
    where: { assigneeId: userId },
    select: { status: true, createdAt: true, closedAt: true },
  });

  const porEstado = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0, CANCELLED: 0 };
  for (const t of tickets) porEstado[t.status] += 1;

  const cerrados = tickets.filter((t) => t.status === 'CLOSED' && t.closedAt);
  const pendientes = porEstado.OPEN + porEstado.IN_PROGRESS;

  return {
    asignados: tickets.length,
    pendientes,
    resueltos: cerrados.length,
    porEstado,
    tiempoPromedioResolucionHoras: promedioHoras(cerrados),
  };
}
