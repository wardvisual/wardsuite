import { Router, Request, Response } from 'express';
import { customersService } from './customers.service';
import { ok, fail } from '../../../core/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await customersService.getAll(req.query.search as string);
  res.json(ok(data, 'Customers fetched successfully', { total: data.length }));
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await customersService.getById(req.params.id);
  if (!item) return res.status(404).json(fail('Customer not found'));
  res.json(ok(item));
});

router.post('/', async (req: Request, res: Response) => {
  const { name, company, email, phone, address } = req.body;
  if (!name || !company || !email || !phone || !address) {
    return res.status(400).json(fail('name, company, email, phone, and address are required'));
  }
  const item = await customersService.create(req.body);
  res.status(201).json(ok(item, 'Customer created successfully'));
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await customersService.update(req.params.id, req.body);
  if (!item) return res.status(404).json(fail('Customer not found'));
  res.json(ok(item, 'Customer updated successfully'));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await customersService.delete(req.params.id);
  if (!deleted) return res.status(404).json(fail('Customer not found'));
  res.json(ok(null, 'Customer deleted successfully'));
});

export default router;
