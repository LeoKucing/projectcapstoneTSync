import express from 'express';
import { isPostgresConnected, pool, localStore } from '../db.js';

const router = express.Router();

// GET analytics overview metrics
router.get('/', async (req, res) => {
  if (isPostgresConnected) {
    try {
      const stats = await pool.query(`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN status = 'done' THEN 1 END) as completed_tasks,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
          COUNT(CASE WHEN status IN ('todo', 'backlog') THEN 1 END) as todo_tasks,
          COUNT(CASE WHEN priority = 'urgent' AND status != 'done' THEN 1 END) as urgent_tasks
        FROM tasks
      `);
      
      const total = parseInt(stats.rows[0].total_tasks) || 0;
      const completed = parseInt(stats.rows[0].completed_tasks) || 0;
      const inProgress = parseInt(stats.rows[0].in_progress_tasks) || 0;
      const todo = parseInt(stats.rows[0].todo_tasks) || 0;
      const urgent = parseInt(stats.rows[0].urgent_tasks) || 0;

      const priorityRes = await pool.query(`
        SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority
      `);
      const priorityCount = { urgent: 0, high: 0, medium: 0, low: 0 };
      priorityRes.rows.forEach(r => {
        priorityCount[r.priority] = parseInt(r.count);
      });

      const projCount = await pool.query('SELECT COUNT(*) FROM projects');
      const memCount = await pool.query('SELECT COUNT(*) FROM members');

      return res.json({
        totalTasks: total,
        completedTasks: completed,
        inProgressTasks: inProgress,
        todoTasks: todo,
        urgentTasks: urgent,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        priorityCount,
        activeProjectsCount: parseInt(projCount.rows[0].count) || 0,
        teamMembersCount: parseInt(memCount.rows[0].count) || 0
      });
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  res.json(localStore.getAnalytics());
});

// GET recent activities feed
router.get('/activities', async (req, res) => {
  if (isPostgresConnected) {
    try {
      const result = await pool.query(`
        SELECT a.id, a.action, a.created_at, t.title as task_title, m.name as user_name, m.avatar as user_avatar
        FROM activities a
        LEFT JOIN tasks t ON a.task_id = t.id
        LEFT JOIN members m ON a.user_id = m.id
        ORDER BY a.created_at DESC
        LIMIT 15
      `);
      return res.json(result.rows.map(r => ({
        id: r.id,
        taskTitle: r.task_title,
        userName: r.user_name || 'Team Member',
        userAvatar: r.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        action: r.action,
        time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } catch (err) {
      console.error('[PostgreSQL Error]:', err.message);
    }
  }

  res.json(localStore.getActivities());
});

export default router;
