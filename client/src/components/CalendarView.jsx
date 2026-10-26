import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function CalendarView({ tasks, onTaskClick, onQuickAddTaskWithDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // Generate grid days
  const calendarCells = [];
  // Empty padding cells before 1st day of month
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ dayNumber: null, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: d,
      dateString: formatted,
      isCurrentMonth: true,
      isToday: new Date().toDateString() === new Date(year, month, d).toDateString()
    });
  }

  // Get tasks for a given date string (YYYY-MM-DD)
  const getTasksForDate = (dateStr) => {
    return tasks.filter(t => t.dueDate === dateStr);
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sprint deadlines and task calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-gray-100 dark:divide-gray-800">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return <div key={idx} className="min-h-[110px] bg-gray-50/50 dark:bg-gray-950/20" />;
            }

            const dayTasks = getTasksForDate(cell.dateString);

            return (
              <div
                key={idx}
                onClick={() => onQuickAddTaskWithDate(cell.dateString)}
                className={`min-h-[110px] p-2 flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors group relative ${
                  cell.isToday ? 'bg-brand-500/5 dark:bg-brand-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                      cell.isToday
                        ? 'bg-brand-500 text-white font-bold shadow-sm'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddTaskWithDate(cell.dateString);
                    }}
                    title="Add task on this date"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-brand-500 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 my-1 overflow-y-auto max-h-20">
                  {dayTasks.map(task => {
                    const priorityDot = task.priority === 'urgent' ? 'bg-rose-500' : task.priority === 'high' ? 'bg-amber-500' : 'bg-brand-500';
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className="px-1.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-medium text-gray-800 dark:text-gray-200 hover:border-brand-500 shadow-xs flex items-center gap-1 truncate transition-colors"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot}`} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="h-1" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
