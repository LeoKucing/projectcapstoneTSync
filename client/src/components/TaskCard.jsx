import React from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  MoreVertical, 
  Tag, 
  Trash2, 
  Edit3,
  AlertCircle
} from 'lucide-react';

const PRIORITY_CONFIG = {
  urgent: {
    label: 'Urgent',
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500 animate-pulse'
  },
  high: {
    label: 'High',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    dot: 'bg-indigo-500'
  },
  low: {
    label: 'Low',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500'
  }
};

export default function TaskCard({ 
  task, 
  members, 
  onTaskClick, 
  onDelete, 
  onDragStart 
}) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const assignee = members.find(m => m.id === task.assigneeId);
  
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const subtasksProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Format Due Date
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const formattedDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onTaskClick(task)}
      className="group relative bg-white dark:bg-gray-800/90 rounded-xl p-4 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:shadow-md hover:border-brand-500/50 dark:hover:border-brand-500/50 cursor-grab active:cursor-grabbing transition-all select-none space-y-3"
    >
      {/* Top Header: Priority Badge & Quick Delete */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priority.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete task "${task.title}"?`)) onDelete(task.id);
          }}
          title="Delete task"
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Title & Description */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {Array.isArray(task.tags) && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/60 text-gray-500">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Subtasks Progress */}
      {subtasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3 h-3 text-brand-500" />
              {completedSubtasks}/{subtasks.length} Subtasks
            </span>
            <span>{subtasksProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${subtasksProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Due Date & Assignee Avatar */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
        {formattedDueDate ? (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${
            isOverdue 
              ? 'text-rose-500 font-semibold' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            {formattedDueDate}
          </span>
        ) : (
          <span className="text-[11px] text-gray-400 italic">No due date</span>
        )}

        {assignee ? (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={assignee.name}
            className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
