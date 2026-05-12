import { Router, Request, Response } from 'express';
import { customersService } from './customers.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { ok, fail } from '@server/core/utils/response';
import { resolveActor, resolveActorName, resolveActorEmail, resolveIP } from '@server/core/middleware/auth.middleware';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await customersService.getAll(req.query.search as string);
  res.json(ok(data, 'Customers fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await customersService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Customer not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { name, company, email, phone, address } = req.body;
  if (!name || !company || !email || !phone || !address) {
    return res.status(400).json(fail('name, company, email, phone, and address are required'));
  }
  const item = await customersService.create(req.body);
  await activitiesService.logAudit({
    relatedEntity: 'customer',
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `Customer "${item.name}" (${item.code}) at ${item.company} created.`,
  });
  res.status(201).json(ok(item, 'Customer created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const before = await customersService.getById(req.params.id);
  if (!before) return res.status(404).json(fail('Customer not found'));
  const item = await customersService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Customer not found'));

  const changes: string[] = [];
  if (req.body.status && req.body.status !== before.status)
    changes.push(`status "${before.status}" → "${req.body.status}"`);
  if (req.body.name && req.body.name !== before.name)
    changes.push(`name → "${req.body.name}"`);

  await activitiesService.logAudit({
    relatedEntity: 'customer',
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: changes.length
      ? `Customer "${before.name}" updated — ${changes.join('; ')}.`
      : `Customer "${before.name}" updated.`,
  });

  res.json(ok(item, 'Customer updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const item = await customersService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Customer not found'));
  await customersService.delete(req.params.id);
  await activitiesService.logAudit({
    relatedEntity: 'customer',
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `Customer "${item.name}" (${item.code}) deleted.`,
  });
  res.json(ok(null, 'Customer deleted successfully'));
});

export default router;
