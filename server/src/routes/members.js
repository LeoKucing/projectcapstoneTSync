import express from 'express';
import { pool, isPostgresConnected, localStore } from '../db.js';

const router = express.Router();

// GET all team members (with their active task counts)
router.get('/', async (req, res) => {
  if (isPostgresConnected) {
    try {
      const result = await pool.query(`
        SELECT m.*, 
               COUNT(t.id) as assigned_tasks,
               COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
        FROM members m
        LEFT JOIN tasks t ON m.id = t.assignee_id
        GROUP BY m.id
        ORDER BY m.name ASC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const members = localStore.getMembers().map(m => {
    const assigned = localStore.tasks.filter(t => t.assigneeId === m.id);
    return {
      ...m,
      assigned_tasks: assigned.length,
      completed_tasks: assigned.filter(t => t.status === 'done').length
    };
  });
  res.json(members);
});

// CREATE new member
router.post('/', async (req, res) => {
  const { name, email, role, department, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (isPostgresConnected) {
    try {
      const id = `mem-${Date.now()}`;
      const result = await pool.query(
        `INSERT INTO members (id, name, email, role, department, avatar)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, name, email, role || 'Member', department || 'Engineering', avatar || null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  const newMember = localStore.addMember(req.body);
  res.status(201).json(newMember);
});

export default router;
