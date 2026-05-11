import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[API Error]', err.message, err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
