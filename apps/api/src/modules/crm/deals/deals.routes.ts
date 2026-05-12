import { Router, Request, Response } from 'express';
import { dealsService } from './deals.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { ok, fail } from '@server/core/utils/response';
import { resolveActor, resolveActorName, resolveIP } from '@server/core/middleware/auth.middleware';

const VALID_STAGES = ['open', 'negotiation', 'proposal', 'won', 'lost'];

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await dealsService.getAll(req.query.stage as string);
  res.json(ok(data, 'Deals fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await dealsService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { title, customerId, amount, ownerId, expectedCloseDate } = req.body;
  if (!title || !customerId || amount == null || !ownerId || !expectedCloseDate) {
    return res.status(400).json(fail('title, customerId, amount, ownerId, and expectedCloseDate are required'));
  }
  const item = await dealsService.create(req.body);
  await activitiesService.logAudit({
    relatedEntity: 'deal',
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: `Deal "${item.title}" (${item.code}) created — $${Number(item.amount).toLocaleString()} at stage "${item.stage}".`,
  });
  res.status(201).json(ok(item, 'Deal created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const before = await dealsService.getById(req.params.id);
  if (!before) return res.status(404).json(fail('Deal not found'));
  const item = await dealsService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Deal not found'));

  const changes: string[] = [];
  if (req.body.amount != null && Number(req.body.amount) !== before.amount)
    changes.push(`amount $${before.amount.toLocaleString()} → $${Number(req.body.amount).toLocaleString()}`);
  if (req.body.stage && req.body.stage !== before.stage)
    changes.push(`stage "${before.stage}" → "${req.body.stage}"`);
  if (req.body.title && req.body.title !== before.title)
    changes.push(`title → "${req.body.title}"`);

  await activitiesService.logAudit({
    relatedEntity: 'deal',
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: changes.length
      ? `Deal "${before.title}" updated — ${changes.join('; ')}.`
      : `Deal "${before.title}" updated.`,
  });

  res.json(ok(item, 'Deal updated successfully'));
});

router.patch('/:id/stage', async (req: Request, res: Response) => {
  const { stage } = req.body;
  if (!stage || !VALID_STAGES.includes(stage)) {
    return res.status(400).json(fail(`stage must be one of: ${VALID_STAGES.join(', ')}`));
  }
  const before = await dealsService.getById(req.params.id);
  if (!before) return res.status(404).json(fail('Deal not found'));
  const item = await dealsService.updateStage(req.params.id, stage);
  if (!item) return res.status(404).json(fail('Deal not found'));

  await activitiesService.logAudit({
    relatedEntity: 'deal',
    relatedEntityId: req.params.id,
    action: 'stage_changed',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: `Deal "${before.title}" moved from "${before.stage}" → "${stage}".`,
  });

  res.json(ok(item, 'Deal stage updated'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deal = await dealsService.getById(req.params.id);
  if (!deal) return res.status(404).json(fail('Deal not found'));
  await dealsService.delete(req.params.id);
  await activitiesService.logAudit({
    relatedEntity: 'deal',
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: `Deal "${deal.title}" (${deal.code}) deleted — was valued at $${deal.amount.toLocaleString()}.`,
  });
  res.json(ok(null, 'Deal deleted successfully'));
});

export default router;
