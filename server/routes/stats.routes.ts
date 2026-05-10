import { Router, Request, Response } from 'express';
import { statsService } from '../services/statsService';
import { ok, fail } from '../utils/response';

const router = Router();

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await statsService.getStats();
    res.json(ok(stats, 'Dashboard stats fetched successfully'));
  } catch {
    res.status(500).json(fail('Failed to fetch dashboard stats'));
  }
});

export default router;
