-- Tsync PostgreSQL Database Schema

-- Drop tables if exist in reverse order of foreign keys
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS subtasks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Members table
CREATE TABLE members (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(50) DEFAULT 'Member',
    department VARCHAR(50) DEFAULT 'Engineering',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    color VARCHAR(30) DEFAULT '#6366f1',
    icon VARCHAR(30) DEFAULT 'FolderKanban',
    status VARCHAR(30) DEFAULT 'active',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- 'backlog', 'todo', 'in_progress', 'review', 'done'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    due_date DATE,
    assignee_id VARCHAR(50) REFERENCES members(id) ON DELETE SET NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subtasks table
CREATE TABLE subtasks (
    id VARCHAR(50) PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table
CREATE TABLE activities (
    id VARCHAR(50) PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(50) REFERENCES members(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
