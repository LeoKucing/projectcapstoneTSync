import express from 'express';
import { pool, isPostgresConnected, localStore } from '../db.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  if (isPostgresConnected) {
    try {
      const result = await pool.query(`
        SELECT p.*, 
               COUNT(t.id) as task_count,
               COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_task_count
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
        GROUP BY p.id
        ORDER BY p.created_at ASC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const projects = localStore.getProjects().map(p => {
    const pTasks = localStore.tasks.filter(t => t.projectId === p.id);
    return {
      ...p,
      task_count: pTasks.length,
      completed_task_count: pTasks.filter(t => t.status === 'done').length
    };
  });
  res.json(projects);
});

// CREATE project
router.post('/', async (req, res) => {
  const { name, description, color, icon, dueDate } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  if (isPostgresConnected) {
    try {
      const id = `proj-${Date.now()}`;
      const result = await pool.query(
        `INSERT INTO projects (id, name, description, color, icon, status, due_date)
         VALUES ($1, $2, $3, $4, $5, 'active', $6)
         RETURNING *`,
        [id, name, description || '', color || '#6366f1', icon || 'FolderKanban', dueDate || null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const newProject = localStore.createProject(req.body);
  res.status(201).json(newProject);
});

export default router;
