import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-2xl border border-gray-700 dark:border-gray-300 animate-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span className="text-xs font-semibold">{toast.message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-75">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
