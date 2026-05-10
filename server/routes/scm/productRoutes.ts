import { Router, Request, Response } from 'express';
import { productService } from '../../services/productService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;
  const data = await productService.getAll(search as string);
  res.json(ok(data, 'Products fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await productService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Product not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { name, category, unit, costPrice, sellingPrice, currentStock, reorderLevel } = req.body;
  if (!name || !category || !unit || costPrice == null || sellingPrice == null || currentStock == null || reorderLevel == null) {
    return res.status(400).json(fail('name, category, unit, costPrice, sellingPrice, currentStock, and reorderLevel are required'));
  }
  const item = await productService.create(req.body);
  res.status(201).json(ok(item, 'Product created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await productService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Product not found'));
  res.json(ok(item, 'Product updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await productService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Product not found'));
  res.json(ok(null, 'Product deleted successfully'));
});

export default router;
