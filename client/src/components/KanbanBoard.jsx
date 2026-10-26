import React, { useState } from 'react';
import { Plus, MoreHorizontal, Circle } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', dotColor: 'bg-slate-400' },
  { id: 'todo', title: 'To Do', dotColor: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', dotColor: 'bg-amber-500' },
  { id: 'review', title: 'In Review', dotColor: 'bg-purple-500' },
  { id: 'done', title: 'Done', dotColor: 'bg-emerald-500' },
];

export default function KanbanBoard({ 
  tasks, 
  members, 
  onTaskClick, 
  onDeleteTask, 
  onStatusChange, 
  onQuickAddTask 
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId && columnId) {
      onStatusChange(taskId, columnId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 lg:p-6">
      <div className="flex gap-5 min-w-[1200px] h-full items-start">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-80 shrink-0 flex flex-col rounded-2xl border transition-all duration-200 ${
                isOver 
                  ? 'border-brand-500 bg-brand-500/5 shadow-glow ring-2 ring-brand-500/20' 
                  : 'border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    {col.title}
                  </h3>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onQuickAddTask(col.id)}
                  title={`Add task to ${col.title}`}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="p-3 space-y-3 min-h-[400px] max-h-[calc(100vh-14rem)] overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-gray-200 dark:border-gray-800/80 rounded-xl flex flex-col items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                    <span>No tasks yet</span>
                    <button
                      onClick={() => onQuickAddTask(col.id)}
                      className="mt-1 text-brand-500 hover:underline text-[11px]"
                    >
                      + Add a task
                    </button>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      members={members}
                      onTaskClick={onTaskClick}
                      onDelete={onDeleteTask}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
