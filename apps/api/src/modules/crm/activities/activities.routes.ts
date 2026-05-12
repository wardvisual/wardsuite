import { Router, Request, Response } from 'express';
import { activitiesService } from './activities.service';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

const VALID_TYPES = ['call', 'meeting', 'note', 'email'];

router.get('/', async (req: Request, res: Response) => {
  const { relatedEntity, relatedEntityId, type } = req.query;
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  const offset = Number(req.query.offset ?? 0);

  const { items, total } = await activitiesService.getAll(
    relatedEntity as string,
    relatedEntityId as string,
    type as string,
    limit,
    offset,
  );
  res.json(ok(items, 'Activities fetched successfully', { total, limit, offset }));
});

router.post('/', async (req: Request, res: Response) => {
  const { relatedEntity, relatedEntityId, type, description } = req.body;
  if (!relatedEntity || !relatedEntityId || !type || !description) {
    return res.status(400).json(fail('relatedEntity, relatedEntityId, type, and description are required'));
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json(fail(`type must be one of: ${VALID_TYPES.join(', ')}`));
  }
  const item = await activitiesService.create(req.body);
  res.status(201).json(ok(item, 'Activity logged successfully'));
});

export default router;
