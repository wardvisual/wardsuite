import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from '@server/routes';
import { errorMiddleware } from '@server/core/middleware/error.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);

  app.use(express.json());
  app.use('/api', apiRoutes);
  app.use(errorMiddleware);

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../../dist/web');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WardSuite API] Listening  → http://localhost:${PORT}`);
    console.log(`[WardSuite API] Environment → ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`[WardSuite API] Firestore   → ${process.env.FIREBASE_DATABASE_ID ?? '(default)'}`);
  });
}

bootstrap();
