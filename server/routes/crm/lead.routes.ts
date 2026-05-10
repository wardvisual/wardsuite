import { Router, Request, Response } from 'express';
import { leadService } from '../../services/leadService';
import { customerService } from '../../services/customerService';
import { activityService } from '../../services/activityService';
import { ok, fail } from '../../utils/response';

const router = Router();

// Resolve actor from Authorization header (falls back to system user)
function resolveActor(req: Request): string {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return 'system';
  // Token format: tok_<random>_<userId>
  const parts = token.split('_');
  return parts[parts.length - 1] ?? 'system';
}

router.get('/', async (req: Request, res: Response) => {
  const { status, search } = req.query;
  const data = await leadService.getAll(status as string, search as string);
  res.json(ok(data, 'Leads fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await leadService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Lead not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { fullName, company, email, phone, source } = req.body;
  if (!fullName || !company || !email || !phone || !source) {
    return res.status(400).json(fail('fullName, company, email, phone, and source are required'));
  }

  const item = await leadService.createLead(req.body);

  await activityService.logAudit({
    relatedEntityId: item.id,
    action: 'created',
    actorId: resolveActor(req),
    summary: `Lead "${item.fullName}" (${item.code}) created from source: ${item.source}.`,
  });

  res.status(201).json(ok(item, 'Lead created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const before = await leadService.getById(req.params.id);
  if (!before) return res.status(404).json(fail('Lead not found'));

  const item = await leadService.updateLead(req.params.id, req.body);

  const changes: string[] = [];
  if (req.body.status && req.body.status !== before.status) {
    changes.push(`status changed from "${before.status}" to "${req.body.status}"`);
  }
  if (req.body.fullName && req.body.fullName !== before.fullName) {
    changes.push(`name changed to "${req.body.fullName}"`);
  }

  await activityService.logAudit({
    relatedEntityId: req.params.id,
    action: 'updated',
    actorId: resolveActor(req),
    summary: changes.length
      ? `Lead "${before.fullName}" updated — ${changes.join('; ')}.`
      : `Lead "${before.fullName}" updated.`,
  });

  res.json(ok(item, 'Lead updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const lead = await leadService.getById(req.params.id);
  if (!lead) return res.status(404).json(fail('Lead not found'));

  await leadService.deleteLead(req.params.id);

  await activityService.logAudit({
    relatedEntityId: req.params.id,
    action: 'deleted',
    actorId: resolveActor(req),
    summary: `Lead "${lead.fullName}" (${lead.code}) was deleted.`,
  });

  res.json(ok(null, 'Lead deleted successfully'));
});

router.post('/:id/convert', async (req: Request, res: Response) => {
  const lead = await leadService.getById(req.params.id);
  if (!lead) return res.status(404).json(fail('Lead not found'));
  if (lead.status === 'won') {
    return res.status(400).json(fail('Lead has already been converted'));
  }

  const customer = await customerService.create({
    name: lead.fullName,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    address: req.body.address ?? '',
    accountManagerId: lead.assignedUserId,
    status: 'active',
  });

  const updatedLead = await leadService.updateLead(req.params.id, { status: 'won' });

  await activityService.logAudit({
    relatedEntityId: lead.id,
    action: 'converted',
    actorId: resolveActor(req),
    summary: `Lead "${lead.fullName}" converted to customer (${customer.code}).`,
  });

  res.status(201).json(ok({ customer, lead: updatedLead }, 'Lead converted to customer successfully'));
});

export default router;
