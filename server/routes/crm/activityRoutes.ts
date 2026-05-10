import { Router, Request, Response } from 'express';
import { activityService } from '../../services/activityService';
import { ok, fail } from '../../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { relatedEntity, relatedEntityId } = req.query;
  const data = await activityService.getAll(relatedEntity as string, relatedEntityId as string);
  res.json(ok(data, 'Activities fetched successfully', { total: data.length }));
});

router.post('/', async (req: Request, res: Response) => {
  const { relatedEntity, relatedEntityId, type, description } = req.body;
  const validTypes = ['call', 'meeting', 'note', 'email'];
  if (!relatedEntity || !relatedEntityId || !type || !description) {
    return res.status(400).json(fail('relatedEntity, relatedEntityId, type, and description are required'));
  }
  if (!validTypes.includes(type)) {
    return res.status(400).json(fail(`type must be one of: ${validTypes.join(', ')}`));
  }
  const item = await activityService.create(req.body);
  res.status(201).json(ok(item, 'Activity logged successfully'));
});

export default router;
