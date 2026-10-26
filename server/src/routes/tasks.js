import express from 'express';
import { pool, isPostgresConnected, localStore } from '../db.js';

const router = express.Router();

// GET all tasks (or filter by projectId)
router.get('/', async (req, res) => {
  const { projectId } = req.query;

  if (isPostgresConnected) {
    try {
      let query = `
        SELECT t.*, 
               m.name as assignee_name, 
               m.avatar as assignee_avatar,
               COALESCE(
                 json_agg(
                   json_build_object('id', s.id, 'title', s.title, 'completed', s.completed)
                 ) FILTER (WHERE s.id IS NOT NULL), '[]'
               ) as subtasks
        FROM tasks t
        LEFT JOIN members m ON t.assignee_id = m.id
        LEFT JOIN subtasks s ON t.id = s.task_id
      `;
      const params = [];
      if (projectId && projectId !== 'all') {
        query += ` WHERE t.project_id = $1`;
        params.push(projectId);
      }
      query += ` GROUP BY t.id, m.name, m.avatar ORDER BY t.position ASC, t.created_at DESC`;

      const result = await pool.query(query, params);
      
      // format response
      const tasks = result.rows.map(r => ({
        id: r.id,
        projectId: r.project_id,
        title: r.title,
        description: r.description,
        status: r.status,
        priority: r.priority,
        dueDate: r.due_date ? r.due_date.toISOString().split('T')[0] : null,
        assigneeId: r.assignee_id,
        tags: Array.isArray(r.tags) ? r.tags : (typeof r.tags === 'string' ? JSON.parse(r.tags) : []),
        position: r.position,
        subtasks: r.subtasks || [],
        createdAt: r.created_at
      }));

      return res.json(tasks);
    } catch (err) {
      console.error('[PostgreSQL Error] fallback to localStore:', err.message);
    }
  }

  // Fallback / In-Memory Local Prototype mode
  const tasks = localStore.getTasks(projectId);
  res.json(tasks);
});

// GET task by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isPostgresConnected) {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const task = localStore.getTaskById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// CREATE task
router.post('/', async (req, res) => {
  const data = req.body;
  if (!data.title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (isPostgresConnected) {
    try {
      const id = `task-${Date.now()}`;
      const query = `
        INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assignee_id, tags, position)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const values = [
        id,
        data.projectId || 'proj-1',
        data.title,
        data.description || '',
        data.status || 'todo',
        data.priority || 'medium',
        data.dueDate || null,
        data.assigneeId || null,
        JSON.stringify(data.tags || []),
        0
      ];
      const result = await pool.query(query, values);

      // insert subtasks if any
      if (Array.isArray(data.subtasks) && data.subtasks.length > 0) {
        for (const sub of data.subtasks) {
          await pool.query(
            `INSERT INTO subtasks (id, task_id, title, completed) VALUES ($1, $2, $3, $4)`,
            [`sub-${Date.now()}-${Math.random().toString(36).substring(7)}`, id, sub.title, !!sub.completed]
          );
        }
      }

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const created = localStore.createTask(data);
  res.status(201).json(created);
});

// UPDATE task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (isPostgresConnected) {
    try {
      const query = `
        UPDATE tasks
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            priority = COALESCE($4, priority),
            due_date = COALESCE($5, due_date),
            assignee_id = COALESCE($6, assignee_id),
            tags = COALESCE($7, tags),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      const values = [
        updates.title,
        updates.description,
        updates.status,
        updates.priority,
        updates.dueDate,
        updates.assigneeId,
        updates.tags ? JSON.stringify(updates.tags) : null,
        id
      ];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const updated = localStore.updateTask(id, updates);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// QUICK STATUS UPDATE (e.g. Kanban Drag & Drop)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, position } = req.body;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  if (isPostgresConnected) {
    try {
      const result = await pool.query(
        'UPDATE tasks SET status = $1, position = COALESCE($2, position), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [status, position, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const updated = localStore.updateTask(id, { status, ...(position !== undefined ? { position } : {}) });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isPostgresConnected) {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      return res.json({ message: 'Task deleted successfully', id });
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const success = localStore.deleteTask(id);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully', id });
});

export default router;
