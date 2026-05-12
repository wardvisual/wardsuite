import { Request, Response, NextFunction } from 'express';
import { authService } from '@server/modules/auth/auth.service';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const user = authService.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  (req as any).user = user;
  next();
}

export function resolveActor(req: Request): string {
  const user = (req as any).user;
  if (user) return user.id;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return 'system';
  const parts = token.split('_');
  return parts[parts.length - 1] ?? 'system';
}

export function resolveIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? req.ip ?? 'unknown';
}

export function resolveActorName(req: Request): string {
  const user = (req as any).user;
  return user?.name ?? 'System';
}
