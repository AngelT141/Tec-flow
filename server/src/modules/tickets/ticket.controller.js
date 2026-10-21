import * as ticketService from './ticket.service.js';
import { badRequest } from '../../lib/errors.js';
import {
  createTicketSchema,
  listQuerySchema,
  assignSchema,
  resolveSchema,
  commentSchema,
} from './ticket.schemas.js';

function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('ID de ticket inválido');
  return id;
}

export async function list(req, res, next) {
  try {
    const result = await ticketService.listTickets(req.user, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const ticket = await ticketService.createTicket(req.user, req.body);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const ticket = await ticketService.getTicket(req.user, parseId(req.params.id));
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function history(req, res, next) {
  try {
    const entries = await ticketService.getHistory(req.user, parseId(req.params.id));
    res.json(entries);
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const { content } = commentSchema.parse(req.body);
    const comment = await ticketService.addComment(req.user, parseId(req.params.id), content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function assign(req, res, next) {
  try {
    const { assigneeId } = assignSchema.parse(req.body);
    const ticket = await ticketService.assignTicket(req.user, parseId(req.params.id), assigneeId);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function resolve(req, res, next) {
  try {
    const { resolutionNote } = resolveSchema.parse(req.body);
    const ticket = await ticketService.resolveTicket(req.user, parseId(req.params.id), resolutionNote);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function close(req, res, next) {
  try {
    const ticket = await ticketService.closeTicket(req.user, parseId(req.params.id));
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function reopen(req, res, next) {
  try {
    const ticket = await ticketService.reopenTicket(req.user, parseId(req.params.id));
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const ticket = await ticketService.cancelTicket(req.user, parseId(req.params.id));
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}
