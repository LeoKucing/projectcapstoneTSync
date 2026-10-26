import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isPostgresConnected } from '../server/src/db.js';
import tasksRouter from '../server/src/routes/tasks.js';
import projectsRouter from '../server/src/routes/projects.js';
import membersRouter from '../server/src/routes/members.js';
import analyticsRouter from '../server/src/routes/analytics.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Lazy database connection initialization for serverless
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
    } catch (e) {
      console.warn('[Vercel Serverless] DB init warning:', e.message);
    }
    dbInitialized = true;
  }
  next();
});

// Health check endpoint
const handleHealth = (req, res) => {
  res.json({
    status: 'online',
    platform: 'Vercel Serverless Function',
    appName: 'Tsync Task Management API',
    version: '1.0.0',
    database: isPostgresConnected ? 'PostgreSQL (Active)' : 'Resilient In-Memory Local Prototype (Active)',
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Mount routes (supporting both with and without /api prefix)
app.use('/api/tasks', tasksRouter);
app.use('/tasks', tasksRouter);

app.use('/api/projects', projectsRouter);
app.use('/projects', projectsRouter);

app.use('/api/members', membersRouter);
app.use('/members', membersRouter);

app.use('/api/analytics', analyticsRouter);
app.use('/analytics', analyticsRouter);

export default app;
