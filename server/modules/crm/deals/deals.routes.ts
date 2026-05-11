import { Router, Request, Response } from 'express';
import { dealsService } from './deals.service';
import { ok, fail } from '@server/core/utils/response';

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
  res.status(201).json(ok(item, 'Deal created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await dealsService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item, 'Deal updated successfully'));
});

router.patch('/:id/stage', async (req: Request, res: Response) => {
  const { stage } = req.body;
  if (!stage || !VALID_STAGES.includes(stage)) {
    return res.status(400).json(fail(`stage must be one of: ${VALID_STAGES.join(', ')}`));
  }
  const item = await dealsService.updateStage(req.params.id, stage);
  if (!item) return res.status(404).json(fail('Deal not found'));
  res.json(ok(item, 'Deal stage updated'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await dealsService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Deal not found'));
  res.json(ok(null, 'Deal deleted successfully'));
});

export default router;
