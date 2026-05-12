import { Router, Request, Response } from 'express';
import { suppliersService } from './suppliers.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { requireAuth, resolveActor, resolveActorName, resolveIP } from '@server/core/middleware/auth.middleware';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await suppliersService.getAll(req.query.search as string);
  res.json(ok(data, 'Suppliers fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await suppliersService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Supplier not found'));
  res.json(ok(item));
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { name, contactPerson, email, phone, address } = req.body;
  if (!name || !contactPerson || !email || !phone || !address) {
    return res.status(400).json(fail('name, contactPerson, email, phone, and address are required'));
  }
  const item = await suppliersService.create(req.body);
  await activitiesService.logAudit({
    relatedEntity: 'supplier',
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: `Supplier "${item.name}" (${item.code}) created — contact: ${item.contactPerson}.`,
  });
  res.status(201).json(ok(item, 'Supplier created successfully'));
});

router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  const before = await suppliersService.getById(req.params.id);
  const item = await suppliersService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Supplier not found'));

  const changes: string[] = [];
  if (req.body.status && before && req.body.status !== before.status)
    changes.push(`status "${before.status}" → "${req.body.status}"`);
  if (req.body.name && before && req.body.name !== before.name)
    changes.push(`name → "${req.body.name}"`);

  await activitiesService.logAudit({
    relatedEntity: 'supplier',
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: changes.length
      ? `Supplier "${item.name}" updated — ${changes.join('; ')}.`
      : `Supplier "${item.name}" updated.`,
  });
  res.json(ok(item, 'Supplier updated successfully'));
});

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const item = await suppliersService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Supplier not found'));
  const deleted = await suppliersService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Supplier not found'));
  await activitiesService.logAudit({
    relatedEntity: 'supplier',
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    ipAddress: resolveIP(req),
    summary: `Supplier "${item.name}" (${item.code}) deleted.`,
  });
  res.json(ok(null, 'Supplier deleted successfully'));
});

export default router;
