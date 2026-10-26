import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Bell, 
  Database, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  toggleTheme, 
  searchQuery, 
  setSearchQuery, 
  onNewTaskClick,
  activeProject,
  projects,
  setActiveProject,
  health,
  onOpenHealthModal
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'Sprint 1 deadline in 2 days', time: '10m ago', unread: true },
    { id: 2, title: 'Rian moved "Kanban Board" to In Progress', time: '25m ago', unread: true },
    { id: 3, title: 'Sarah uploaded new design tokens', time: '1h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-colors">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-sm"
          >
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: activeProject?.color || '#6366f1' }}
            />
            <span className="truncate max-w-[140px] md:max-w-[200px]">
              {activeProject?.name || 'All Projects'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showProjectDropdown && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                Workspaces
              </div>
              <button
                onClick={() => {
                  setActiveProject(null);
                  setShowProjectDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700/60 ${!activeProject ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
              >
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                All Projects
              </button>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    setShowProjectDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700/60 ${activeProject?.id === p.id ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Database indicator pill */}
        <button
          onClick={onOpenHealthModal}
          title="Click to view database & server status"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium hover:bg-emerald-500/20 transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="w-3 h-3" />
          <span>{health?.database?.includes('PostgreSQL') ? 'PostgreSQL Active' : 'Local Prototype DB'}</span>
        </button>
      </div>

      {/* Center: Search Bar with Ctrl+K shortcut */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, tags, or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-gray-200 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-white dark:bg-gray-900">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Task Button */}
        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md hover:shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Notifications
                </span>
                <span className="text-[11px] text-brand-500 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs transition-colors cursor-pointer">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Alex Pratama"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
          />
        </div>
      </div>
    </header>
  );
}
