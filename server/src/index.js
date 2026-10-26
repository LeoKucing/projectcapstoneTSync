import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isPostgresConnected } from './db.js';
import tasksRouter from './routes/tasks.js';
import projectsRouter from './routes/projects.js';
import membersRouter from './routes/members.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/members', membersRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint with database mode indicator
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Tsync Task Management API',
    version: '1.0.0',
    database: isPostgresConnected ? 'PostgreSQL (Active)' : 'Resilient In-Memory Local Prototype (Active)',
    timestamp: new Date().toISOString()
  });
});

// Start server
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[Tsync Server] Running on http://localhost:${PORT}`);
    console.log(`[Tsync Server] Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
