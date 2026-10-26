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

// Enable CORS for all origins (allowing frontend on Vercel to access backend)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Lazy database initialization middleware (especially important for serverless)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
    } catch (e) {
      console.warn('[Tsync Server] Lazy DB init:', e.message);
    }
    dbInitialized = true;
  }
  next();
});

// Health check handler
const handleHealth = (req, res) => {
  res.json({
    status: 'online',
    appName: 'Tsync Task Management API',
    version: '1.0.0',
    database: isPostgresConnected ? 'PostgreSQL (Active)' : 'Resilient In-Memory Local Prototype (Active)',
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);
app.get('/', (req, res) => {
  res.json({
    message: 'Tsync Task Management REST API is online.',
    docs: '/api/health'
  });
});

// Mount routes on both /api/* and /* for flexibility
app.use('/api/tasks', tasksRouter);
app.use('/tasks', tasksRouter);

app.use('/api/projects', projectsRouter);
app.use('/projects', projectsRouter);

app.use('/api/members', membersRouter);
app.use('/members', membersRouter);

app.use('/api/analytics', analyticsRouter);
app.use('/analytics', analyticsRouter);

export default app;
