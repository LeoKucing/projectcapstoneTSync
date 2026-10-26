import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  Filter, 
  ArrowUpDown,
  Search
} from 'lucide-react';

const STATUS_LABELS = {
  backlog: { label: 'Backlog', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  todo: { label: 'To Do', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  review: { label: 'In Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
};

const PRIORITY_BADGES = {
  urgent: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
  high: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
  medium: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900',
  low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
};

export default function ListView({ 
  tasks, 
  members, 
  onTaskClick, 
  onDeleteTask, 
  onStatusChange 
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter tasks
  let filtered = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  // Sort tasks
  filtered.sort((a, b) => {
    if (sortField === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999;
      return sortAsc ? dateA - dateB : dateB - dateA;
    }
    if (sortField === 'title') {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {(statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="text-brand-600 dark:text-brand-400 hover:underline text-xs ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> of {tasks.length} tasks
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-10">Done</th>
                <th className="py-3 px-4 cursor-pointer hover:text-brand-500" onClick={() => toggleSort('title')}>
                  <div className="flex items-center gap-1">
                    Task Title
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 cursor-pointer hover:text-brand-500" onClick={() => toggleSort('dueDate')}>
                  <div className="flex items-center gap-1">
                    Due Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No tasks match the active filters.
                  </td>
                </tr>
              ) : (
                filtered.map(task => {
                  const assignee = members.find(m => m.id === task.assigneeId);
                  const isDone = task.status === 'done';
                  const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS.todo;
                  const priorityClass = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Done Toggle */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onStatusChange(task.id, isDone ? 'todo' : 'done')}
                          className="text-gray-400 hover:text-emerald-500 transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Tags */}
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100 max-w-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className={`${isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                          {Array.isArray(task.tags) && task.tags.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {task.tags.map((tg, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => onStatusChange(task.id, e.target.value)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border-0 focus:ring-1 focus:ring-brand-500 cursor-pointer ${statusInfo.color}`}
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">In Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityClass}`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="italic text-gray-400">-</span>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="truncate max-w-[100px] text-gray-700 dark:text-gray-300">
                              {assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (confirm(`Delete task "${task.title}"?`)) onDeleteTask(task.id);
                          }}
                          className="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
