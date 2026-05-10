import { Router, Request, Response } from 'express';
import { stockMovementService } from '../../services/stockMovementService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { productId } = req.query;
  const data = await stockMovementService.getAll(productId as string);
  res.json(ok(data, 'Stock movements fetched successfully', { total: data.length }));
});

router.post('/', async (req: Request, res: Response) => {
  const { productId, quantity, type, reference } = req.body;
  const validTypes = ['in', 'out', 'adjustment'];
  if (!productId || quantity == null || !type || !reference) {
    return res.status(400).json(fail('productId, quantity, type, and reference are required'));
  }
  if (!validTypes.includes(type)) {
    return res.status(400).json(fail(`type must be one of: ${validTypes.join(', ')}`));
  }
  const item = await stockMovementService.create(req.body);
  res.status(201).json(ok(item, 'Stock movement recorded successfully'));
});

export default router;
