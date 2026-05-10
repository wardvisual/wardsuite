import { Router, Request, Response } from 'express';
import { customerService } from '../../services/customerService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;
  const data = await customerService.getAll(search as string);
  res.json(ok(data, 'Customers fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await customerService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Customer not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { name, company, email, phone, address } = req.body;
  if (!name || !company || !email || !phone || !address) {
    return res.status(400).json(fail('name, company, email, phone, and address are required'));
  }
  const item = await customerService.create(req.body);
  res.status(201).json(ok(item, 'Customer created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await customerService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Customer not found'));
  res.json(ok(item, 'Customer updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await customerService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Customer not found'));
  res.json(ok(null, 'Customer deleted successfully'));
});

export default router;
