import { Router, Request, Response } from 'express';
import { usersService } from './users.service';
import { authService } from '@server/modules/auth/auth.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { requireAuth, resolveIP, resolveActorName, resolveActorEmail } from '@server/core/middleware/auth.middleware';
import { ok, fail } from '@server/core/utils/response';

const router = Router();

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');
  const authUser = authService.getUserByToken(token);
  if (!authUser) return res.status(401).json(fail('Unauthorized'));

  const profile = await usersService.getProfile(authUser.id);
  res.json(ok({ ...authUser, ...(profile ?? {}) }, 'Profile fetched'));
});

router.put('/me', requireAuth, async (req: Request, res: Response) => {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');
  const authUser = authService.getUserByToken(token);
  if (!authUser) return res.status(401).json(fail('Unauthorized'));

  const { name, timezone, language, currency } = req.body;
  const profile = await usersService.upsertProfile(authUser.id, {
    name: name ?? authUser.name,
    email: authUser.email,
    timezone,
    language,
    currency,
  });

  await activitiesService.logAudit({
    relatedEntity: 'user',
    relatedEntityId: authUser.id,
    action: 'updated',
    actorId: authUser.id,
    actorName: resolveActorName(req),
    actorEmail: resolveActorEmail(req),
    ipAddress: resolveIP(req),
    summary: `User profile updated — name: "${profile.name}", timezone: "${profile.timezone ?? 'unchanged'}".`,
  });

  res.json(ok({ ...authUser, ...profile }, 'Profile updated'));
});

export default router;
