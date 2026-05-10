import { Router, Request, Response } from 'express';
import { stockMovementsService } from './stock-movements.service';
import { ok, fail } from '../../../core/utils/response';

const VALID_TYPES = ['in', 'out', 'adjustment'];

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await stockMovementsService.getAll(req.query.productId as string);
  res.json(ok(data, 'Stock movements fetched successfully', { total: data.length }));
});

router.post('/', async (req: Request, res: Response) => {
  const { productId, quantity, type, reference } = req.body;
  if (!productId || quantity == null || !type || !reference) {
    return res.status(400).json(fail('productId, quantity, type, and reference are required'));
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json(fail(`type must be one of: ${VALID_TYPES.join(', ')}`));
  }
  const item = await stockMovementsService.create(req.body);
  res.status(201).json(ok(item, 'Stock movement recorded'));
});

export default router;
