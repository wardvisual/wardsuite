import { Router, Request, Response } from 'express';
import { activitiesService } from './activities.service';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

const VALID_TYPES = ['call', 'meeting', 'note', 'email'];

router.get('/', async (req: Request, res: Response) => {
  const { relatedEntity, relatedEntityId, type } = req.query;
  const data = await activitiesService.getAll(
    relatedEntity as string,
    relatedEntityId as string,
    type as string,
  );
  res.json(ok(data, 'Activities fetched successfully', { total: data.length }));
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
