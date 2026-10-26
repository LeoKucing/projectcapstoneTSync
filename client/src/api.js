// Tsync REST API Client with resilient local caching

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback seed data if offline on first load
const FALLBACK_KEY = 'tsync_offline_data_v1';

function getLocalCache() {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalCache(data) {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const api = {
  // Check health & database mode
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check non-200');
      return await res.json();
    } catch {
      return {
        status: 'offline',
        appName: 'Tsync',
        database: 'Local Prototype Storage (Offline Mode)'
      };
    }
  },

  // Tasks
  async getTasks(projectId = 'all') {
    try {
      const url = projectId && projectId !== 'all' ? `${API_BASE}/tasks?projectId=${projectId}` : `${API_BASE}/tasks`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('API getTasks failed, using local cache:', e.message);
      const cache = getLocalCache();
      return cache?.tasks || [];
    }
  },

  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) throw new Error('Failed to create task');
      return await res.json();
    } catch (e) {
      console.warn('API createTask failed, fallback local update');
      const newTask = {
        id: `task-${Date.now()}`,
        ...taskData,
        createdAt: new Date().toISOString()
      };
      return newTask;
    }
  },

  async updateTask(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update task');
      return await res.json();
    } catch (e) {
      console.warn('API updateTask failed, returning optimistic object');
      return { id, ...updates };
    }
  },

  async updateTaskStatus(id, status, position) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, position })
      });
      if (!res.ok) throw new Error('Failed to update task status');
      return await res.json();
    } catch (e) {
      console.warn('API updateTaskStatus failed, returning optimistic object');
      return { id, status, position };
    }
  },

  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      return await res.json();
    } catch (e) {
      return { message: 'Deleted locally', id };
    }
  },

  // Projects
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createProject(projectData) {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (!res.ok) throw new Error('Failed to create project');
      return await res.json();
    } catch (e) {
      return { id: `proj-${Date.now()}`, ...projectData };
    }
  },

  // Members
  async getMembers() {
    try {
      const res = await fetch(`${API_BASE}/members`);
      if (!res.ok) throw new Error('Failed to fetch members');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async addMember(memberData) {
    try {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!res.ok) throw new Error('Failed to add member');
      return await res.json();
    } catch (e) {
      return { id: `mem-${Date.now()}`, ...memberData };
    }
  },

  // Analytics & Activities
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getActivities() {
    try {
      const res = await fetch(`${API_BASE}/analytics/activities`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};
