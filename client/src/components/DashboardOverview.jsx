import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Flame,
  Calendar,
  Zap
} from 'lucide-react';

export default function DashboardOverview({ 
  analytics, 
  tasks, 
  projects, 
  members, 
  activities,
  onViewBoard,
  onNewTaskClick 
}) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentList = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').slice(0, 3);

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Sprint Synchronized & Live</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Welcome to Tsync Workspace
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl mt-1">
              You have <span className="font-bold text-white">{inProgressTasks} tasks in progress</span> and <span className="font-bold text-white">{urgentTasks} urgent tasks</span> requiring attention today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewTaskClick}
              className="px-4 py-2.5 rounded-xl bg-white text-brand-600 font-bold text-sm hover:bg-indigo-50 shadow-md transition-all active:scale-95"
            >
              + Create New Task
            </button>
            <button
              onClick={onViewBoard}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              Open Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Tasks
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {totalTasks}
            </h3>
            <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
              Across {projects.length} active spaces
            </span>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              In Progress
            </p>
            <h3 className="text-2xl font-bold text-amber-500 mt-1">
              {inProgressTasks}
            </h3>
            <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
              Active engineering sprint
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed & Rate */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Completed
            </p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">
              {completedTasks}
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              {completionRate}% Completion Rate
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Urgent Attention
            </p>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">
              {urgentTasks}
            </h3>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 mt-1">
              High priority blockers
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Section: Progress Overview & Urgent Tasks List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Progress */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Sprint Workflow Progress
            </h3>
            <span className="text-xs text-gray-400 font-medium">Real-time sync</span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500" 
              title="Done"
            />
            <div 
              style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }} 
              className="bg-amber-500 h-full transition-all duration-500" 
              title="In Progress"
            />
            <div 
              style={{ width: `${totalTasks > 0 ? ((totalTasks - completedTasks - inProgressTasks) / totalTasks) * 100 : 0}%` }} 
              className="bg-brand-500 h-full transition-all duration-500" 
              title="To Do / Backlog"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Done</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{completedTasks}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">In Progress</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{inProgressTasks}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">To Do & Backlog</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{totalTasks - completedTasks - inProgressTasks}</p>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Active Project Spaces
            </h4>
            <div className="space-y-2">
              {projects.map(p => {
                const pTasks = tasks.filter(t => t.projectId === p.id);
                const pDone = pTasks.filter(t => t.status === 'done').length;
                const pPct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
                return (
                  <div key={p.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{pTasks.length} tasks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{pPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Activity Stream
            </h3>
            <span className="text-xs text-brand-500 font-semibold cursor-pointer hover:underline">
              View all
            </span>
          </div>

          <div className="space-y-3.5">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No recent activity recorded.</p>
            ) : (
              activities.map((act, i) => (
                <div key={act.id || i} className="flex items-start gap-3 text-xs">
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200">
                      <span className="font-semibold text-gray-900 dark:text-white">{act.userName}</span>{' '}
                      <span className="text-gray-500 dark:text-gray-400">{act.action}</span>
                    </p>
                    {act.taskTitle && (
                      <p className="text-[11px] font-medium text-brand-600 dark:text-brand-400 truncate">
                        "{act.taskTitle}"
                      </p>
                    )}
                    <span className="text-[10px] text-gray-400">{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
