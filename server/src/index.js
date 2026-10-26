import app from './app.js';
import { initDatabase } from './db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[Tsync Server] Running on http://localhost:${PORT}`);
    console.log(`[Tsync Server] Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
