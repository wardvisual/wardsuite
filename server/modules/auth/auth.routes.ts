import { Router, Request, Response } from 'express';
import { authService } from './auth.service';
import { ok, fail } from '../../core/utils/response';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(fail('Email and password are required'));
  }
  const result = authService.login({ email, password });
  if (!result) return res.status(401).json(fail('Invalid email or password'));
  res.json(ok(result, 'Login successful'));
});

router.post('/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) authService.logout(token);
  res.json(ok(null, 'Logged out successfully'));
});

router.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json(fail('No token provided'));
  const user = authService.getUserByToken(token);
  if (!user) return res.status(401).json(fail('Invalid or expired token'));
  res.json(ok(user));
});

export default router;
