import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Trash2,
  Eye,
  X,
  UserPlus,
  RotateCcw,
  Sparkles,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  CheckSquare,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';

export const AdminEmployees: React.FC = () => {
  const {
    employees,
    departments,
    addEmployee,
    deleteEmployee,
    createTask,
    setActiveView,
    resetToScratch,
    registerEmployee,
    verifyRegisterOtp,
    adminUnlockCheckIn,
  } = useApp();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [assigningTaskEmp, setAssigningTaskEmp] = useState<Employee | null>(null);
  const [taskNotice, setTaskNotice] = useState<string | null>(null);

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    deadline: '28 Sep 2026',
  });

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTaskEmp || !taskFormData.title.trim()) return;

    createTask({
      title: taskFormData.title,
      description: taskFormData.description,
      assignedToId: assigningTaskEmp.id,
      priority: taskFormData.priority,
      deadline: taskFormData.deadline,
      subtasks: ['Review initial requirements', 'Submit progress report'],
    });

    const empName = assigningTaskEmp.fullName;
    const empEmail = assigningTaskEmp.email;
    setAssigningTaskEmp(null);
    setTaskFormData({ title: '', description: '', priority: 'HIGH', deadline: '28 Sep 2026' });

    setTaskNotice(
      `Task successfully assigned to ${empName}. Official email automatically dispatched to ${empEmail} from wonderlightadventure@gmail.com.`
    );
    setTimeout(() => setTaskNotice(null), 6000);
  };

  // New employee manual modal form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: departments[0]?.id || 'dept-1',
    designation: '',
    joiningDate: '24 Sep 2026',
    address: 'Mumbai, Maharashtra',
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || emp.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.designation) return;

    addEmployee(formData);
    setShowAddModal(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      departmentId: departments[0]?.id || 'dept-1',
      designation: '',
      joiningDate: '24 Sep 2026',
      address: 'Mumbai, Maharashtra',
    });
  };

  // Quick helper to register a sample employee in 1 click for demonstration
  const handleQuickRegisterSample = async () => {
    const samples = [
      {
        fullName: 'Aarav Sharma',
        email: `aarav.${Date.now().toString().slice(-4)}@wonderlightadventure.com`,
        phone: '+91 98765 12340',
        departmentId: departments[0]?.id || 'dept-1',
        designation: 'Expeditions Lead',
      },
      {
        fullName: 'Neha Patel',
        email: `neha.${Date.now().toString().slice(-4)}@wonderlightadventure.com`,
        phone: '+91 98111 22334',
        departmentId: departments[2]?.id || 'dept-3',
        designation: 'Software Developer',
      },
      {
        fullName: 'Vikram Mehta',
        email: `vikram.${Date.now().toString().slice(-4)}@wonderlightadventure.com`,
        phone: '+91 98222 33445',
        departmentId: departments[3]?.id || 'dept-4',
        designation: 'Digital Marketing Specialist',
      },
    ];

    const sample = samples[employees.length % samples.length];
    const res = await registerEmployee(sample);
    if (res.otp) {
      await verifyRegisterOtp(sample.email, res.otp);
    }
  };

  return (
    <div className="space-y-6">
      {/* Automatic Task Assignment Email Notice Banner */}
      {taskNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-900 animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold block text-emerald-950 mb-0.5">Task Assigned & Email Dispatched</span>
            <span>{taskNotice}</span>
          </div>
          <button onClick={() => setTaskNotice(null)} className="text-emerald-500 hover:text-emerald-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Header with live counters and quick actions */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#071A2F]">Personnel Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#168BFF] border border-blue-100">
              {employees.length} Signed Up
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time live roster of all employees who registered through the onboarding portal.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('signup')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5"
            title="Open the Sign-Up Form to register a new employee"
          >
            <UserPlus size={15} />
            <span>+ Sign Up New Employee</span>
          </button>

          <button
            onClick={handleQuickRegisterSample}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center gap-1.5"
            title="Fast 1-click test to simulate an employee signing up"
          >
            <Sparkles size={14} className="text-emerald-600" />
            <span>Quick Test Sign-Up</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Manual Entry</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset workspace to empty scratch state (0 employees)?')) {
                resetToScratch();
              }
            }}
            className="px-3 py-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors flex items-center gap-1.5"
            title="Wipe state back to empty"
          >
            <RotateCcw size={14} />
            <span>Reset to 0</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Registered</span>
          <div className="text-2xl font-black text-[#071A2F] mt-1">{employees.length}</div>
          <span className="text-[11px] text-[#168BFF] font-semibold mt-0.5 block">
            {employees.length === 0 ? 'Fresh workspace' : 'Live directory'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active Status</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {employees.filter((e) => e.status === 'Active').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Verified accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Departments</span>
          <div className="text-2xl font-black text-[#071A2F] mt-1">
            {new Set(employees.map((e) => e.departmentName)).size}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Active divisions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Working / On Duty</span>
          <div className="text-2xl font-black text-[#18BFFF] mt-1">
            {employees.filter((e) => e.workingStatus === 'Working').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Clocked in today</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID code, email, designation..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF]"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
          >
            <option value="ALL">All Departments ({employees.length})</option>
            {departments.map((d) => {
              const count = employees.filter((e) => e.departmentId === d.id).length;
              return (
                <option key={d.id} value={d.id}>
                  {d.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Employees Table or Empty Scratch State */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        {employees.length === 0 ? (
          /* Empty State when Starting From Scratch */
          <div className="p-10 sm:p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-[#168BFF] shadow-xs">
              <UserPlus size={32} />
            </div>
            <h3 className="text-xl font-black text-[#071A2F]">
              No Employees Have Signed Up Yet
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              This workspace is clean from scratch. Whenever an employee registers through the Sign-Up portal, their full profile, department, and credentials will instantly show up in this Admin table.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveView('signup')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                <span>Go to Employee Sign-Up Portal</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={handleQuickRegisterSample}
                className="w-full sm:w-auto px-4 py-3 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} className="text-[#168BFF]" />
                <span>Register Sample Employee (1-Click)</span>
              </button>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          /* Filter No Results */
          <div className="p-12 text-center text-slate-400 text-sm">
            No employees match your search or department filter.
          </div>
        ) : (
          /* Populated Employees Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Designation</th>
                  <th className="py-3.5 px-6">Signed Up / Joined</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Employee Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-[#168BFF]/20 shrink-0">
                          <img
                            src={emp.profileImage}
                            alt={emp.fullName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] text-white flex items-center justify-center font-bold text-xs">
                            {emp.fullName.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 leading-tight">
                              {emp.fullName}
                            </span>
                            {emp.signupDate && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{emp.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-4 px-6 font-mono font-bold text-[#168BFF] tabular-nums">
                      {emp.employeeCode}
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {emp.departmentName}
                    </td>

                    {/* Designation */}
                    <td className="py-4 px-6 text-slate-600">
                      {emp.designation}
                    </td>

                    {/* Signed Up / Joining Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{emp.signupTimestamp || emp.joiningDate}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{emp.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {emp.shiftCompletedToday && !emp.allowReCheckInToday ? (
                          <button
                            onClick={() => adminUnlockCheckIn(emp.id)}
                            className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs px-2.5 border border-amber-200"
                            title="Unlock check-in for this employee today"
                          >
                            <Lock size={13} className="text-amber-600" />
                            <span>Unlock Check-In</span>
                          </button>
                        ) : emp.allowReCheckInToday ? (
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Re-Check-In Active
                          </span>
                        ) : null}
                        <button
                          onClick={() => setAssigningTaskEmp(emp)}
                          className="p-1.5 text-[#168BFF] hover:text-[#18BFFF] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs px-2"
                          title="Assign Task & Send Email Notification"
                        >
                          <CheckSquare size={15} />
                          <span className="hidden sm:inline">Assign Task</span>
                        </button>
                        <button
                          onClick={() => setSelectedEmp(emp)}
                          className="p-1.5 text-slate-500 hover:text-[#168BFF] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${emp.fullName} from directory?`)) {
                              deleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#071A2F]">Add New Employee (Manual)</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Company Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@wonderlightadventure.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Mountain Guide"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="text"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all"
                >
                  Save to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Detail Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Signed-Up Employee Profile</h3>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-4 ring-[#168BFF]/20 shadow-md">
                <img
                  src={selectedEmp.profileImage}
                  alt={selectedEmp.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-slate-900">{selectedEmp.fullName}</h4>
              <span className="text-xs font-mono font-bold text-[#168BFF]">
                {selectedEmp.employeeCode}
              </span>

              <div className="mt-4 space-y-2 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Official Email:</span>
                  <span className="font-semibold text-slate-800">{selectedEmp.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedEmp.departmentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-slate-800">{selectedEmp.designation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-800">{selectedEmp.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Signed Up / Registered:</span>
                  <span className="font-medium text-slate-800">{selectedEmp.signupTimestamp || selectedEmp.joiningDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Account Status:</span>
                  <span className="font-bold text-emerald-600">{selectedEmp.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  deleteEmployee(selectedEmp.id);
                  setSelectedEmp(null);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Delete Profile
              </button>
              <button
                onClick={() => setSelectedEmp(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#168BFF] text-white hover:bg-[#1270cc] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Task Assignment Modal */}
      {assigningTaskEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#071A2F]">Assign Task</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  To: <span className="font-semibold text-slate-800">{assigningTaskEmp.fullName}</span> ({assigningTaskEmp.email})
                </p>
              </div>
              <button
                onClick={() => setAssigningTaskEmp(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  placeholder="e.g. Complete Q3 Revenue Audit & Report"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Description
                </label>
                <textarea
                  rows={3}
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  placeholder="Detailed instructions for the assigned employee..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deadline Date
                  </label>
                  <input
                    type="text"
                    value={taskFormData.deadline}
                    onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <Mail size={16} className="text-[#168BFF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-blue-950 mb-0.5">Automatic Email Dispatch</span>
                  Assigning this task will automatically trigger a styled notification email from the official company address <strong>wonderlightadventure@gmail.com</strong> directly to <strong>{assigningTaskEmp.email}</strong>.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningTaskEmp(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#168BFF] text-white hover:bg-[#1270cc] transition-colors shadow-xs"
                >
                  Assign &amp; Send Mail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
