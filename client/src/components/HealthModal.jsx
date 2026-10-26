import React from 'react';
import { X, Database, CheckCircle, AlertTriangle, Terminal, RefreshCw } from 'lucide-react';

export default function HealthModal({ isOpen, onClose, health, onRefreshHealth }) {
  if (!isOpen) return null;

  const isPostgres = health?.database?.includes('PostgreSQL');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-500" />
            Database & System Status
          </h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isPostgres 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
            : 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
        }`}>
          {isPostgres ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-sm">
              Current Active Mode: {health?.database || 'Local Prototype Mode'}
            </p>
            <p className="text-xs mt-1 opacity-90">
              {isPostgres 
                ? 'Your Express REST API is actively persisting tasks into your local PostgreSQL database.'
                : 'Prototype is running smoothly in Local Prototype Mode. All tasks, projects, and activities are live and functional.'}
            </p>
          </div>
        </div>

        {/* PostgreSQL setup instructions if not yet active */}
        {!isPostgres && (
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 mb-1">
              <Terminal className="w-4 h-4 text-brand-500" />
              <span>To connect your local PostgreSQL database:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
              <li>Ensure PostgreSQL is running on port 5432.</li>
              <li>Create a database: <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">createdb tsync_db</code></li>
              <li>Update credentials in <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">server/.env</code> if needed.</li>
              <li>Tsync server will automatically apply tables from <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">server/schema.sql</code>!</li>
            </ol>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onRefreshHealth}
            className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-check Connection
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
