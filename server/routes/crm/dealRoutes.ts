import { Router, Request, Response } from 'express';
import { dealService } from '../../services/dealService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { stage } = req.query;
  const data = await dealService.getAll(stage as string);
  res.json(ok(data, 'Deals fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await dealService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { title, customerId, amount, ownerId, expectedCloseDate } = req.body;
  if (!title || !customerId || amount == null || !ownerId || !expectedCloseDate) {
    return res.status(400).json(fail('title, customerId, amount, ownerId, and expectedCloseDate are required'));
  }
  const item = await dealService.create(req.body);
  res.status(201).json(ok(item, 'Deal created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await dealService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item, 'Deal updated successfully'));
});

router.patch('/:id/stage', async (req: Request, res: Response) => {
  const { stage } = req.body;
  const validStages = ['open', 'negotiation', 'proposal', 'won', 'lost'];
  if (!stage || !validStages.includes(stage)) {
    return res.status(400).json(fail(`stage must be one of: ${validStages.join(', ')}`));
  }
  const item = await dealService.updateStage(req.params.id, { stage });
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item, 'Deal stage updated'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await dealService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Deal not found'));
  res.json(ok(null, 'Deal deleted successfully'));
});

export default router;
