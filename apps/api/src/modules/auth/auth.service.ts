import { createHmac } from 'crypto';
import { User, LoginDto, LoginResponse } from './auth.dto';

const DEMO_USERS: (User & { password: string })[] = [
  { id: 'u1', email: 'admin@wardsuite.com', password: 'admin123', role: 'ADMIN', name: 'Admin User', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'u2', email: 'manager@wardsuite.com', password: 'manager123', role: 'MANAGER', name: 'Jane Manager', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'u3', email: 'staff@wardsuite.com', password: 'staff123', role: 'STAFF', name: 'Bob Staff', createdAt: '2025-01-01T00:00:00Z' },
];

// 30-day expiry in seconds
const TOKEN_TTL = 60 * 60 * 24 * 30;

function getSecret(): string {
  return process.env.JWT_SECRET ?? 'wardsuite-dev-secret-change-in-production';
}

function signToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL,
  })).toString('base64url');
  const sig = createHmac('sha256', getSecret())
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${sig}`;
}

function verifyToken(token: string): string | null {
  try {
    const [header, payload, sig] = token.split('.');
    if (!header || !payload || !sig) return null;
    const expected = createHmac('sha256', getSecret())
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (sig !== expected) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { sub: string; exp: number };
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded.sub;
  } catch {
    return null;
  }
}

class AuthService {
  login(dto: LoginDto): LoginResponse | null {
    const found = DEMO_USERS.find(u => u.email === dto.email && u.password === dto.password);
    if (!found) return null;
    const token = signToken(found.id);
    const { password: _pw, ...user } = found;
    return { token, user };
  }

  // JWT is stateless — logout is handled client-side by discarding the token
  logout(_token: string): void {}

  getUserByToken(token: string): User | null {
    const userId = verifyToken(token);
    if (!userId) return null;
    const found = DEMO_USERS.find(u => u.id === userId);
    if (!found) return null;
    const { password: _pw, ...user } = found;
    return user;
  }

  getUserById(id: string): User | null {
    const found = DEMO_USERS.find(u => u.id === id);
    if (!found) return null;
    const { password: _pw, ...user } = found;
    return user;
  }
}

export const authService = new AuthService();
