import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  ListTodo, 
  Calendar, 
  Users, 
  FolderPlus, 
  FolderKanban, 
  Layers, 
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  projects, 
  activeProject, 
  setActiveProject, 
  onNewProjectClick,
  tasksCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'board', label: 'Kanban Board', icon: Kanban, badge: tasksCount },
    { id: 'list', label: 'List View', icon: ListTodo },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'team', label: 'Team Members', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] flex flex-col shrink-0 h-[calc(100vh-4rem)] select-none transition-colors">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/80">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow flex items-center justify-center bg-gray-900">
          <img src="/logo.png" alt="Tsync Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Tsync
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Sync Tasks, Deliver Sprints</p>
        </div>
      </div>

      {/* Main Views Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Overview
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Workspaces / Projects Section */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Projects
          </span>
          <button
            onClick={onNewProjectClick}
            title="Create new project"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1 mt-1">
          {/* All Projects button */}
          <button
            onClick={() => setActiveProject(null)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              !activeProject 
                ? 'bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="truncate">All Projects</span>
          </button>

          {/* Individual Projects */}
          {projects.map(p => {
            const isSelected = activeProject?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProject(p)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                  isSelected 
                    ? 'bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: p.color || '#6366f1' }}
                  />
                  <span className="truncate">{p.name}</span>
                </div>
                {p.task_count !== undefined && (
                  <span className="text-[10px] text-gray-400 opacity-60 group-hover:opacity-100">
                    {p.task_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro / Capstone Prototype Badge */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-transparent border border-brand-500/20 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tsync Pro Prototype</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Realtime sync engine with PostgreSQL & React.
          </p>
        </div>
      </div>
    </aside>
  );
}
