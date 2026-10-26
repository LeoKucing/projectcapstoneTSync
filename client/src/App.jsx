import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import DashboardOverview from './components/DashboardOverview';
import TeamMembers from './components/TeamMembers';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import HealthModal from './components/HealthModal';
import Toast from './components/Toast';
import { api } from './api';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tsync_theme') || 'dark');
  const [currentView, setCurrentView] = useState('board');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [health, setHealth] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');
  const [defaultDueDate, setDefaultDueDate] = useState('');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  // Apply dark theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tsync_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial Data Fetch
  const loadData = async () => {
    try {
      const [fetchedTasks, fetchedProjects, fetchedMembers, fetchedActivities, fetchedHealth] = await Promise.all([
        api.getTasks(activeProject?.id || 'all'),
        api.getProjects(),
        api.getMembers(),
        api.getActivities(),
        api.getHealth()
      ]);

      setTasks(fetchedTasks || []);
      setProjects(fetchedProjects || []);
      setMembers(fetchedMembers || []);
      setActivities(fetchedActivities || []);
      setHealth(fetchedHealth);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(t => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = t.title?.toLowerCase().includes(query);
    const descMatch = t.description?.toLowerCase().includes(query);
    const tagMatch = Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(query));
    return titleMatch || descMatch || tagMatch;
  });

  // Task actions
  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      // Update
      const updated = await api.updateTask(taskData.id, taskData);
      setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
      showToast(`Task "${updated.title}" updated`);
    } else {
      // Create
      const created = await api.createTask({
        ...taskData,
        projectId: activeProject?.id || taskData.projectId || projects[0]?.id || 'proj-1'
      });
      setTasks(prev => [created, ...prev]);
      showToast(`Task "${created.title}" created successfully`);
    }
    loadData();
  };

  const handleDeleteTask = async (taskId) => {
    await api.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed from workspace');
    loadData();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await api.updateTaskStatus(taskId, newStatus);
    showToast(`Task moved to ${newStatus.replace('_', ' ')}`);
    loadData();
  };

  // Quick modals triggers
  const openNewTaskModal = (status = 'todo', date = '') => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setDefaultDueDate(date);
    setTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleCreateProject = async (projectData) => {
    const newProj = await api.createProject(projectData);
    setProjects(prev => [...prev, newProj]);
    setActiveProject(newProj);
    showToast(`Project workspace "${newProj.name}" created`);
    loadData();
  };

  const handleAddMember = async (memberData) => {
    const newMember = await api.addMember(memberData);
    setMembers(prev => [...prev, newMember]);
    showToast(`Added ${newMember.name} to Tsync team`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewTaskClick={() => openNewTaskModal()}
        activeProject={activeProject}
        projects={projects}
        setActiveProject={setActiveProject}
        health={health}
        onOpenHealthModal={() => setHealthModalOpen(true)}
      />

      {/* Main Content Area: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          projects={projects}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          onNewProjectClick={() => setProjectModalOpen(true)}
          tasksCount={tasks.length}
        />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-[#0B0F19]/50">
          {currentView === 'dashboard' && (
            <DashboardOverview
              analytics={analytics}
              tasks={filteredTasks}
              projects={projects}
              members={members}
              activities={activities}
              onViewBoard={() => setCurrentView('board')}
              onNewTaskClick={() => openNewTaskModal()}
            />
          )}

          {currentView === 'board' && (
            <KanbanBoard
              tasks={filteredTasks}
              members={members}
              onTaskClick={openEditTaskModal}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onQuickAddTask={(colId) => openNewTaskModal(colId)}
            />
          )}

          {currentView === 'list' && (
            <ListView
              tasks={filteredTasks}
              members={members}
              onTaskClick={openEditTaskModal}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={filteredTasks}
              onTaskClick={openEditTaskModal}
              onQuickAddTaskWithDate={(date) => openNewTaskModal('todo', date)}
            />
          )}

          {currentView === 'team' && (
            <TeamMembers
              members={members}
              tasks={tasks}
              onAddMember={handleAddMember}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        projects={projects}
        members={members}
        defaultStatus={defaultTaskStatus}
        defaultDueDate={defaultDueDate}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <HealthModal
        isOpen={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
        health={health}
        onRefreshHealth={loadData}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
