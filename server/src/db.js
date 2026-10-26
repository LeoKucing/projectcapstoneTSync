import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialMembers, initialProjects, initialTasks, initialActivities } from './mockData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Local fallback database state
class LocalStore {
  constructor() {
    this.members = [...initialMembers];
    this.projects = [...initialProjects];
    this.tasks = [...initialTasks];
    this.activities = [...initialActivities];
  }

  getTasks(projectId) {
    if (!projectId || projectId === 'all') return this.tasks;
    return this.tasks.filter(t => t.projectId === projectId);
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  createTask(data) {
    const newTask = {
      id: `task-${Date.now()}`,
      projectId: data.projectId || 'proj-1',
      title: data.title || 'Untitled Task',
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      assigneeId: data.assigneeId || null,
      tags: data.tags || [],
      position: this.tasks.length,
      subtasks: data.subtasks || [],
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);

    this.addActivity({
      taskId: newTask.id,
      taskTitle: newTask.title,
      userName: "Alex Pratama",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      action: "created task",
      time: "Just now"
    });

    return newTask;
  }

  updateTask(id, updates) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const oldTask = this.tasks[idx];
    const updated = { ...oldTask, ...updates, updatedAt: new Date().toISOString() };
    this.tasks[idx] = updated;

    if (updates.status && updates.status !== oldTask.status) {
      this.addActivity({
        taskId: updated.id,
        taskTitle: updated.title,
        userName: "Alex Pratama",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        action: `moved task to ${updates.status.replace('_', ' ')}`,
        time: "Just now"
      });
    }

    return updated;
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }

  getProjects() {
    return this.projects;
  }

  createProject(data) {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: data.name || 'New Project',
      description: data.description || '',
      color: data.color || '#6366f1',
      icon: data.icon || 'FolderKanban',
      status: 'active',
      dueDate: data.dueDate || null,
      createdAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return newProject;
  }

  getMembers() {
    return this.members;
  }

  addMember(data) {
    const newMember = {
      id: `mem-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      role: data.role || 'Member',
      department: data.department || 'Engineering'
    };
    this.members.push(newMember);
    return newMember;
  }

  getActivities() {
    return this.activities.slice(0, 15);
  }

  addActivity(act) {
    this.activities.unshift({
      id: `act-${Date.now()}`,
      ...act
    });
  }

  getAnalytics() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = this.tasks.filter(t => t.status === 'in_progress').length;
    const todoTasks = this.tasks.filter(t => t.status === 'todo' || t.status === 'backlog').length;
    const urgentTasks = this.tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Distribution by priority
    const priorityCount = {
      urgent: this.tasks.filter(t => t.priority === 'urgent').length,
      high: this.tasks.filter(t => t.priority === 'high').length,
      medium: this.tasks.filter(t => t.priority === 'medium').length,
      low: this.tasks.filter(t => t.priority === 'low').length,
    };

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      urgentTasks,
      completionRate,
      priorityCount,
      activeProjectsCount: this.projects.length,
      teamMembersCount: this.members.length
    };
  }
}

export const localStore = new LocalStore();

// Setup PostgreSQL pool
export let pool = null;
export let isPostgresConnected = false;

export async function initDatabase() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tsync_db';
  
  try {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 5000
    });

    const client = await pool.connect();
    console.log('[Tsync DB] Successfully connected to PostgreSQL database!');
    isPostgresConnected = true;

    // Check if tables exist, or run schema
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks'
      );
    `);

    if (!checkTable.rows[0].exists) {
      console.log('[Tsync DB] Initializing PostgreSQL schema & seed...');
      const schemaPath = path.resolve(__dirname, '../schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('[Tsync DB] Schema applied successfully.');
        
        // Seed initial data into PostgreSQL
        for (const m of initialMembers) {
          await client.query(
            `INSERT INTO members (id, name, email, avatar, role, department) 
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
            [m.id, m.name, m.email, m.avatar, m.role, m.department]
          );
        }
        for (const p of initialProjects) {
          await client.query(
            `INSERT INTO projects (id, name, description, color, icon, status, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
            [p.id, p.name, p.description, p.color, p.icon, p.status, p.dueDate]
          );
        }
        for (const t of initialTasks) {
          await client.query(
            `INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assignee_id, tags, position)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
            [t.id, t.projectId, t.title, t.description, t.status, t.priority, t.dueDate, t.assigneeId, JSON.stringify(t.tags), t.position]
          );
        }
        console.log('[Tsync DB] Seed data inserted into PostgreSQL.');
      }
    }
    client.release();
  } catch (err) {
    console.warn('[Tsync DB] Notice: PostgreSQL is not currently running or reachable (' + err.message + ').');
    console.log('[Tsync DB] Switching to resilient In-Memory Local Prototype mode. All API operations will function seamlessly.');
    isPostgresConnected = false;
  }
}
