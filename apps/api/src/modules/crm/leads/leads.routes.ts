import { Router, Request, Response } from 'express';
import { leadsService } from './leads.service';
import { customersService } from '@server/modules/crm/customers/customers.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { ok, fail } from '@server/core/utils/response';
import { resolveActor, resolveActorName, resolveActorEmail, resolveIP } from '@server/core/middleware/auth.middleware';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { status, search } = req.query;
  const data = await leadsService.getAll(status as string, search as string);
  res.json(ok(data, 'Leads fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await leadsService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Lead not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { fullName, company, email, phone, source } = req.body;
  if (!fullName || !company || !email || !phone || !source) {
    return res.status(400).json(fail('fullName, company, email, phone, and source are required'));
  }
  const item = await leadsService.create(req.body);
  await activitiesService.logAudit({
    relatedEntity: 'lead',
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `Lead "${item.fullName}" (${item.code}) created from source: ${item.source}.`,
  });
  res.status(201).json(ok(item, 'Lead created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const before = await leadsService.getById(req.params.id);
  if (!before) return res.status(404).json(fail('Lead not found'));

  const item = await leadsService.update(req.params.id, req.body);

  const changes: string[] = [];
  if (req.body.status && req.body.status !== before.status)
    changes.push(`status "${before.status}" → "${req.body.status}"`);
  if (req.body.fullName && req.body.fullName !== before.fullName)
    changes.push(`name → "${req.body.fullName}"`);

  await activitiesService.logAudit({
    relatedEntity: 'lead',
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: changes.length
      ? `Lead "${before.fullName}" updated — ${changes.join('; ')}.`
      : `Lead "${before.fullName}" updated.`,
  });

  res.json(ok(item, 'Lead updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const lead = await leadsService.getById(req.params.id);
  if (!lead) return res.status(404).json(fail('Lead not found'));

  await leadsService.delete(req.params.id);
  await activitiesService.logAudit({
    relatedEntity: 'lead',
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `Lead "${lead.fullName}" (${lead.code}) deleted.`,
  });

  res.json(ok(null, 'Lead deleted successfully'));
});

router.post('/:id/convert', async (req: Request, res: Response) => {
  const lead = await leadsService.getById(req.params.id);
  if (!lead) return res.status(404).json(fail('Lead not found'));
  if (lead.status === 'won') return res.status(400).json(fail('Lead has already been converted'));

  const customer = await customersService.create({
    name: lead.fullName,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    address: req.body.address ?? '',
    accountManagerId: lead.assignedUserId,
    status: 'active',
  });

  const updatedLead = await leadsService.update(req.params.id, { status: 'won' });

  await activitiesService.logAudit({
    relatedEntity: 'lead',
    relatedEntityId: lead.id,
    action: 'converted',
    actorId: resolveActor(req),
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `Lead "${lead.fullName}" converted to customer (${customer.code}).`,
  });

  res.status(201).json(ok({ customer, lead: updatedLead }, 'Lead converted to customer successfully'));
});

export default router;
