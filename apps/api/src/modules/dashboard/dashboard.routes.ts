import { Router, Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(ok(stats, 'Dashboard stats fetched successfully'));
  } catch {
    res.status(500).json(fail('Failed to fetch dashboard stats'));
  }
});

export default router;
