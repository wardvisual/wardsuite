import { Router, Request, Response } from 'express';
import { leadService } from '../../services/leadService';
import { customerService } from '../../services/customerService';
import { ok, fail } from '../../utils/response';

const router = Router();

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
  res.status(201).json(ok(item, 'Lead created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await leadService.updateLead(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Lead not found'));
  res.json(ok(item, 'Lead updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await leadService.deleteLead(req.params.id);
  if (!deleted) return res.status(404).json(fail('Lead not found'));
  res.json(ok(null, 'Lead deleted successfully'));
});

router.post('/:id/convert', async (req: Request, res: Response) => {
  const lead = await leadService.getById(req.params.id);
  if (!lead) return res.status(404).json(fail('Lead not found'));

  const customer = await customerService.create({
    name: lead.fullName,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    address: req.body.address ?? '',
    accountManagerId: lead.assignedUserId,
    status: 'active',
  });

  await leadService.updateLead(req.params.id, { status: 'won' });

  res.status(201).json(ok({ customer, lead: { ...lead, status: 'won' } }, 'Lead converted to customer successfully'));
});

export default router;
