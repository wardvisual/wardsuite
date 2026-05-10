import { User, UserRole, LoginDto, LoginResponse } from './auth.dto';

// Demo users — in production these come from MySQL via Drizzle
const DEMO_USERS: (User & { password: string })[] = [
  { id: 'u1', email: 'admin@wardsuite.com', password: 'admin123', role: 'ADMIN', name: 'Admin User', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'u2', email: 'manager@wardsuite.com', password: 'manager123', role: 'MANAGER', name: 'Jane Manager', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'u3', email: 'staff@wardsuite.com', password: 'staff123', role: 'STAFF', name: 'Bob Staff', createdAt: '2025-01-01T00:00:00Z' },
];

// In-memory token store — swap for Redis or a signed JWT in production
const sessions = new Map<string, string>();

class AuthService {
  login(dto: LoginDto): LoginResponse | null {
    const found = DEMO_USERS.find(u => u.email === dto.email && u.password === dto.password);
    if (!found) return null;
    const token = `tok_${Math.random().toString(36).substring(2)}_${found.id}`;
    sessions.set(token, found.id);
    const { password: _pw, ...user } = found;
    return { token, user };
  }

  logout(token: string): void {
    sessions.delete(token);
  }

  getUserByToken(token: string): User | null {
    const userId = sessions.get(token);
    if (!userId) return null;
    const found = DEMO_USERS.find(u => u.id === userId);
    if (!found) return null;
    const { password: _pw, ...user } = found;
    return user;
  }
}

export const authService = new AuthService();
