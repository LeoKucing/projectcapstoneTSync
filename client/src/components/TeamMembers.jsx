import React, { useState } from 'react';
import { Users, Mail, Briefcase, Plus, CheckCircle, Clock } from 'lucide-react';

export default function TeamMembers({ members, tasks, onAddMember }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Frontend Engineer');
  const [department, setDepartment] = useState('Engineering');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    onAddMember({ name, email, role, department });
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Tsync Team Workload
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage your project collaborators, workload allocation, and department assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
          const doneTasks = memberTasks.filter(t => t.status === 'done').length;

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:border-brand-500/50 transition-all space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/20"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> Active Tasks
                  </span>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {activeTasks}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Finished
                  </span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {doneTasks}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Invite Team Member
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="budi@tsync.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Role / Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer, Product Designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-sm"
                >
                  Add Collaborator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
