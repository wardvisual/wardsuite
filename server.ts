import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import apiRoutes from './server/routes';
import { errorMiddleware } from './server/core/middleware/error.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);

  app.use(express.json());

  // API routes
  app.use('/api', apiRoutes);

  // Global error handler — must be registered after all routes
  app.use(errorMiddleware);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WardSuite] Server running → http://localhost:${PORT}`);
    console.log(`[WardSuite] Environment   → ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`[WardSuite] Firestore DB  → ${process.env.FIREBASE_DATABASE_ID ?? '(default)'}`);
  });
}

bootstrap();
