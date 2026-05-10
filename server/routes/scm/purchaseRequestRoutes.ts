import { Router, Request, Response } from 'express';
import { purchaseRequestService } from '../../services/purchaseRequestService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const data = await purchaseRequestService.getAll();
  res.json(ok(data, 'Purchase requests fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await purchaseRequestService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Purchase request not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { supplierId, requestedById, items } = req.body;
  if (!supplierId || !requestedById || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json(fail('supplierId, requestedById, and at least one item are required'));
  }
  const item = await purchaseRequestService.create(req.body);
  res.status(201).json(ok(item, 'Purchase request created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await purchaseRequestService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Purchase request not found'));
  res.json(ok(item, 'Purchase request updated successfully'));
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['draft', 'submitted', 'approved', 'rejected', 'ordered', 'received'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json(fail(`status must be one of: ${validStatuses.join(', ')}`));
  }
  const item = await purchaseRequestService.updateStatus(req.params.id, { status });
  if (!item) return res.status(404).json(fail('Purchase request not found'));
  res.json(ok(item, 'Purchase request status updated'));
});

export default router;
