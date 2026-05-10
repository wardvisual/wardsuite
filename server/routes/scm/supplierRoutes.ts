import { Router, Request, Response } from 'express';
import { supplierService } from '../../services/supplierService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;
  const data = await supplierService.getAll(search as string);
  res.json(ok(data, 'Suppliers fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await supplierService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Supplier not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { name, contactPerson, email, phone, address } = req.body;
  if (!name || !contactPerson || !email || !phone || !address) {
    return res.status(400).json(fail('name, contactPerson, email, phone, and address are required'));
  }
  const item = await supplierService.create(req.body);
  res.status(201).json(ok(item, 'Supplier created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await supplierService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Supplier not found'));
  res.json(ok(item, 'Supplier updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await supplierService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Supplier not found'));
  res.json(ok(null, 'Supplier deleted successfully'));
});

export default router;
