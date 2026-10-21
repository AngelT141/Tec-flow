import { prisma } from '../../lib/prisma.js';
import { notFound, forbidden, badRequest } from '../../lib/errors.js';

const PUBLIC_USER = { id: true, name: true, email: true, role: true };
const TICKET_INCLUDE = {
  category: true,
  creator: { select: PUBLIC_USER },
  assignee: { select: PUBLIC_USER },
};

const DIAS_AUTO_CIERRE = 7;

export function formatTicketCode(number) {
  return `TEC-${String(number).padStart(4, '0')}`;
}

function esAgenteOAdmin(user) {
  return user.role === 'AGENT' || user.role === 'ADMIN';
}

function esGestorDeTicket(user, ticket) {
  return user.role === 'ADMIN' || user.id === ticket.creatorId;
}

async function cargarTicket(id) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      ...TICKET_INCLUDE,
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: PUBLIC_USER } },
      },
    },
  });
  if (!ticket) throw notFound('Ticket no encontrado');
  return ticket;
}

function verificarAcceso(user, ticket) {
  if (esAgenteOAdmin(user)) return;
  if (user.id === ticket.creatorId || user.id === ticket.assigneeId) return;
  throw notFound('Ticket no encontrado');
}

function verificarTransicion(statusActual, esperado, accion) {
  if (statusActual !== esperado) {
    throw badRequest(`${accion} no permitido en el estado actual del ticket`);
  }
}

async function transicionar(ticket, user, nuevoEstado, accion, datosExtra = {}) {
  const [, updated] = await prisma.$transaction([
    prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: nuevoEstado,
        ...(nuevoEstado === 'CLOSED' || nuevoEstado === 'CANCELLED' ? { closedAt: new Date() } : {}),
        ...datosExtra,
      },
      include: TICKET_INCLUDE,
    }),
    prisma.historyEntry.create({
      data: {
        ticketId: ticket.id,
        actorId: user.id,
        action: accion,
        oldValue: ticket.status,
        newValue: nuevoEstado,
      },
    }),
  ]);
  return { ...updated, code: formatTicketCode(updated.number) };
}

async function aplicarAutoCierre(ticket) {
  if (ticket.status !== 'RESOLVED') return ticket;
  const umbral = Date.now() - DIAS_AUTO_CIERRE * 24 * 60 * 60 * 1000;
  if (new Date(ticket.updatedAt).getTime() > umbral) return ticket;

  const actorId = ticket.assigneeId || ticket.creatorId;
  const [, updated] = await prisma.$transaction([
    prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'CLOSED', closedAt: new Date() },
    }),
    prisma.historyEntry.create({
      data: {
        ticketId: ticket.id,
        actorId,
        action: 'auto_closed',
        oldValue: 'RESOLVED',
        newValue: 'CLOSED',
      },
    }),
  ]);
  return { ...ticket, ...updated };
}

export async function createTicket(user, input) {
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, active: true },
  });
  if (!category) throw badRequest('Categoría inválida o inactiva');

  const ticket = await prisma.$transaction(async (tx) => {
    const counter = await tx.counter.update({
      where: { name: 'ticket_number' },
      data: { value: { increment: 1 } },
    });
    const created = await tx.ticket.create({
      data: {
        number: counter.value,
        title: input.title,
        description: input.description,
        type: input.type,
        priority: input.priority,
        categoryId: category.id,
        creatorId: user.id,
        status: 'OPEN',
      },
      include: TICKET_INCLUDE,
    });
    await tx.historyEntry.create({
      data: {
        ticketId: created.id,
        actorId: user.id,
        action: 'ticket_created',
        newValue: 'OPEN',
      },
    });
    return created;
  });

  return { ...ticket, code: formatTicketCode(ticket.number) };
}

export async function listTickets(user, query) {
  const where = {
    ...(query.status && { status: query.status }),
    ...(query.type && { type: query.type }),
    ...(query.priority && { priority: query.priority }),
    ...(query.q && { title: { contains: query.q, mode: 'insensitive' } }),
    ...(!esAgenteOAdmin(user) && { creatorId: user.id }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        creator: { select: PUBLIC_USER },
        assignee: { select: PUBLIC_USER },
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    items: items.map((t) => ({ ...t, code: formatTicketCode(t.number) })),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function getTicket(user, id) {
  const ticket = await cargarTicket(id);
  verificarAcceso(user, ticket);
  const final = await aplicarAutoCierre(ticket);
  return { ...final, code: formatTicketCode(final.number) };
}

export async function getHistory(user, id) {
  const ticket = await cargarTicket(id);
  verificarAcceso(user, ticket);
  return prisma.historyEntry.findMany({
    where: { ticketId: id },
    include: { actor: { select: PUBLIC_USER } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function addComment(user, id, content) {
  const ticket = await cargarTicket(id);
  verificarAcceso(user, ticket);
  if (ticket.status === 'CLOSED' || ticket.status === 'CANCELLED') {
    throw badRequest('No se pueden agregar comentarios a un ticket cerrado o cancelado');
  }

  return prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: { ticketId: id, authorId: user.id, content },
      include: { author: { select: PUBLIC_USER } },
    });
    await tx.historyEntry.create({
      data: { ticketId: id, actorId: user.id, action: 'comment_added' },
    });
    return comment;
  });
}

export async function assignTicket(user, id, assigneeId) {
  const ticket = await cargarTicket(id);
  if (['RESOLVED', 'CLOSED', 'CANCELLED'].includes(ticket.status)) {
    throw badRequest('El ticket no admite asignación en su estado actual');
  }

  const targetId = assigneeId || user.id;
  const target = await prisma.user.findFirst({
    where: { id: targetId, active: true, role: { in: ['AGENT', 'ADMIN'] } },
    select: { id: true, name: true },
  });
  if (!target) throw badRequest('El usuario asignado debe ser un agente o administrador activo');

  const asignadoAnterior = ticket.assigneeId
    ? await prisma.user.findUnique({ where: { id: ticket.assigneeId }, select: { name: true } })
    : null;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.ticket.update({
      where: { id },
      data: { assigneeId: target.id, status: 'IN_PROGRESS' },
      include: TICKET_INCLUDE,
    });
    await tx.historyEntry.create({
      data: {
        ticketId: id,
        actorId: user.id,
        action: 'assigned',
        oldValue: asignadoAnterior?.name ?? 'sin asignar',
        newValue: target.name,
      },
    });

    if (ticket.status === 'OPEN') {
      await tx.historyEntry.create({
        data: {
          ticketId: id,
          actorId: user.id,
          action: 'status_changed',
          oldValue: 'OPEN',
          newValue: 'IN_PROGRESS',
        },
      });
    }

    return { ...updated, code: formatTicketCode(updated.number) };
  });
}

export async function resolveTicket(user, id, resolutionNote) {
  const ticket = await cargarTicket(id);
  verificarTransicion(ticket.status, 'IN_PROGRESS', 'Resolver el ticket');
  return transicionar(ticket, user, 'RESOLVED', 'status_changed', { resolutionNote });
}

export async function closeTicket(user, id) {
  const ticket = await cargarTicket(id);
  if (!esGestorDeTicket(user, ticket)) {
    throw forbidden('Solo el creador o un administrador pueden cerrar el ticket');
  }
  verificarTransicion(ticket.status, 'RESOLVED', 'Cerrar el ticket');
  return transicionar(ticket, user, 'CLOSED', 'status_changed');
}

export async function reopenTicket(user, id) {
  const ticket = await cargarTicket(id);
  if (!esGestorDeTicket(user, ticket)) {
    throw forbidden('Solo el creador o un administrador pueden reabrir el ticket');
  }
  verificarTransicion(ticket.status, 'RESOLVED', 'Reabrir el ticket');
  return transicionar(ticket, user, 'IN_PROGRESS', 'status_changed');
}

export async function cancelTicket(user, id) {
  const ticket = await cargarTicket(id);
  if (!esGestorDeTicket(user, ticket)) {
    throw forbidden('Solo el creador o un administrador pueden cancelar el ticket');
  }
  verificarTransicion(ticket.status, 'OPEN', 'Cancelar el ticket');
  if (ticket.assigneeId) {
    throw badRequest('No se puede cancelar un ticket con agente asignado');
  }
  return transicionar(ticket, user, 'CANCELLED', 'status_changed');
}
