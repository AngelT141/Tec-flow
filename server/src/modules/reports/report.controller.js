import * as reportService from './report.service.js';
import { summaryQuerySchema } from './report.schemas.js';

export async function summary(req, res, next) {
  try {
    const { from, to } = summaryQuerySchema.parse(req.query);
    const result = await reportService.summary({ from, to });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function agentMe(req, res, next) {
  try {
    const result = await reportService.metricasAgente(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
