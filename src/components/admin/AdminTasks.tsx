import React, { useState, useRef } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Trash2,
  Edit2,
  Mail,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Eye,
  Paperclip,
  Download,
  Upload,
  FolderPlus,
  FileType,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, TaskFileAttachment } from '../../types';
import { AestheticDatePicker } from '../common/AestheticDatePicker';

export const AdminTasks: React.FC = () => {
  const {
    tasks,
    employees,
    departments,
    createTask,
    deleteTask,
    updateTaskStatus,
    openEmailModal,
    emails,
    retryTaskEmail,
    uploadTaskFile,
    deleteTaskFile,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdminTaskId, setSelectedAdminTaskId] = useState<string | null>(null);
  const [retryingTaskId, setRetryingTaskId] = useState<string | null>(null);
  const [alertNotice, setAlertNotice] = useState<{ type: 'success' | 'warning' | 'error'; message: string; taskId?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAdminTask = selectedAdminTaskId ? tasks.find((t) => t.id === selectedAdminTaskId) : null;

  const handleDownloadFile = (file: TaskFileAttachment) => {
    if (!file.fileData) return;
    const link = document.createElement('a');
    link.href = file.fileData;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0 || !activeAdminTask) return;

    setIsUploading(true);
    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadTaskFile(activeAdminTask.id, selectedFiles[i]);
    }
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToId: employees[0]?.id || 'emp-1',
    priority: 'HIGH' as TaskPriority,
    deadline: '26 Sep 2026',
    subtasks: ['Setup initial architecture', 'Implement review cycle'],
  });
  const [subtaskInput, setSubtaskInput] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, subtaskInput.trim()],
    });
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (index: number) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((_, i) => i !== index),
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.assignedToId) return;

    createTask({
      title: formData.title,
      description: formData.description,
      assignedToId: formData.assignedToId,
      priority: formData.priority,
      deadline: formData.deadline,
      subtasks: formData.subtasks,
    });

    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      assignedToId: employees[0]?.id || 'emp-1',
      priority: 'HIGH',
      deadline: '26 Sep 2026',
      subtasks: ['Setup initial architecture', 'Implement review cycle'],
    });

    setAlertNotice({
      type: 'success',
      message: 'Task assigned successfully. Notification email dispatched from wonderlightadventure@gmail.com.',
    });
    setTimeout(() => setAlertNotice(null), 6000);
  };

  const handleRetryEmail = async (taskId: string) => {
    setRetryingTaskId(taskId);
    try {
      const result = await retryTaskEmail(taskId);
      if (result.success) {
        setAlertNotice({
          type: 'success',
          message: 'Notification email successfully resent to employee.',
        });
      } else {
        setAlertNotice({
          type: 'warning',
          message: 'Task assigned successfully, but the notification email could not be sent. Please retry.',
          taskId,
        });
      }
    } finally {
      setRetryingTaskId(null);
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Urgent</span>;
      case 'HIGH':
        return <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">High</span>;
      case 'MEDIUM':
        return <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Medium</span>;
      default:
        return <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600" /> Submitted
          </span>
        );
      case 'IN_PROGRESS':
        return <span className="text-xs font-semibold text-[#168BFF] bg-blue-50 px-2.5 py-1 rounded-lg">In Progress</span>;
      case 'ON_HOLD':
        return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">On Hold</span>;
      default:
        return <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Not Started</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Task Delegation</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Assign deliverables across departments with automatic official email dispatches from <strong className="text-slate-700">wonderlightadventure@gmail.com</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Alert Notice Banner */}
      {alertNotice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            alertNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : alertNotice.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertNotice.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
            )}
            <span className="font-semibold">{alertNotice.message}</span>
          </div>

          {alertNotice.taskId && (
            <button
              onClick={() => handleRetryEmail(alertNotice.taskId!)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs cursor-pointer ml-4"
            >
              Retry Email
            </button>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or assignee..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                <th className="py-3.5 px-6">Task Title</th>
                <th className="py-3.5 px-6">Assigned To</th>
                <th className="py-3.5 px-6">Official Email</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Deadline</th>
                <th className="py-3.5 px-6">Progress</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block leading-tight">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {task.description}
                    </span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#168BFF] font-bold text-xs flex items-center justify-center">
                        {task.assignedToName.substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block leading-tight">{task.assignedToName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{task.assignedToEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Official Email Delivery Status & Retry */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {task.emailDeliveryStatus === 'FAILED' ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          <AlertCircle size={12} /> Failed
                        </span>
                        <button
                          onClick={() => handleRetryEmail(task.id)}
                          disabled={retryingTaskId === task.id}
                          className="text-[11px] font-bold text-[#168BFF] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {retryingTaskId === task.id ? (
                            <RefreshCw size={11} className="animate-spin" />
                          ) : (
                            'Retry Email'
                          )}
                        </button>
                      </div>
                    ) : task.emailDeliveryStatus === 'RETRYING' || retryingTaskId === task.id ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        <RefreshCw size={12} className="animate-spin" /> Retrying...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={12} /> Dispatched
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {getPriorityBadge(task.priority)}
                  </td>

                  <td className="py-4 px-6 font-mono text-slate-700 whitespace-nowrap">
                    {task.deadline}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#168BFF] rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {getStatusBadge(task.status)}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* View & Download Uploaded Work */}
                      <button
                        onClick={() => setSelectedAdminTaskId(task.id)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#168BFF] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        title="View Work & Download Files to Desktop"
                      >
                        <Download size={14} />
                        <span>Files ({task.fileAttachments?.length || task.attachments?.length || 0})</span>
                      </button>

                      {/* View Email dispatched */}
                      <button
                        onClick={() => {
                          const relevantEmail = emails.find(
                            (e) => e.type === 'TASK' && e.toName === task.assignedToName
                          ) || emails[0];
                          if (relevantEmail) openEmailModal(relevantEmail);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                        title="View Official Email Dispatched"
                      >
                        <Mail size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete task "${task.title}"?`)) {
                            deleteTask(task.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Task"
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
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#071A2F]">Create New Task</h2>
                <span className="text-xs text-slate-400">
                  Official notification dispatched from wonderlightadventure@gmail.com
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Website Homepage Development"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Employee
                  </label>
                  <select
                    value={formData.assignedToId}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.departmentName} - {emp.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="URGENT">Urgent Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <AestheticDatePicker
                label="Deadline Date"
                required
                placeholder="dd-mm-yyyy"
                value={formData.deadline}
                onChange={(val) => setFormData({ ...formData, deadline: val })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specify task deliverables, expectations, and instructions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              {/* Subtasks Builder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtasks Checklist
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    placeholder="Add subtask milestone..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {formData.subtasks.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-100"
                    >
                      <span className="text-slate-700">{st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(i)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Email Notice Box */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <Mail size={16} className="text-[#168BFF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Official Company Sender: wonderlightadventure@gmail.com</span>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Upon clicking <strong>ASSIGN TASK</strong>, a formal assignment email with secure task link will be dispatched to the selected employee.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>ASSIGN TASK</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Admin Task Details & Desktop Download Modal */}
      {activeAdminTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Admin Task Portal · File Inspection &amp; Downloads
                  </span>
                  {getPriorityBadge(activeAdminTask.priority)}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#071A2F]">
                  {activeAdminTask.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>Assigned to: <strong>{activeAdminTask.assignedToName}</strong> ({activeAdminTask.assignedToCode})</span>
                  <span>·</span>
                  <span>Deadline: <strong>{activeAdminTask.deadline}</strong></span>
                  <span>·</span>
                  <span>Department: <strong>{activeAdminTask.department}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAdminTaskId(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Task Overview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Progress</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#168BFF] rounded-full" style={{ width: `${activeAdminTask.progress}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800">{activeAdminTask.progress}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Status</span>
                  <div className="mt-1">{getStatusBadge(activeAdminTask.status)}</div>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Task Description
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {activeAdminTask.description}
                </p>
              </div>

              {/* Admin & Employee Uploaded Files Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Paperclip size={14} className="text-[#168BFF]" />
                    <span>Employee Uploaded Work &amp; Files ({activeAdminTask.fileAttachments?.length || activeAdminTask.attachments?.length || 0})</span>
                  </h4>

                  {/* Admin File Upload Button */}
                  <label
                    htmlFor="admin-file-upload-input"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#168BFF] hover:bg-[#1270cc] text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>{isUploading ? 'Uploading...' : 'Attach Reference File'}</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="admin-file-upload-input"
                  />
                </div>

                {activeAdminTask.fileAttachments && activeAdminTask.fileAttachments.length > 0 ? (
                  <div className="space-y-2.5">
                    {activeAdminTask.fileAttachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/80 hover:border-blue-200 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#168BFF] flex items-center justify-center shrink-0">
                            {file.type === 'PDF' ? (
                              <span className="font-extrabold text-[10px] text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">PDF</span>
                            ) : file.type === 'IMAGE' ? (
                              <span className="font-extrabold text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200">IMG</span>
                            ) : file.type === 'ARCHIVE' ? (
                              <span className="font-extrabold text-[10px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">ZIP</span>
                            ) : (
                              <FileType size={18} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{file.formattedSize}</span>
                              <span>·</span>
                              <span>Uploaded by <strong>{file.uploadedBy}</strong> ({file.uploadedByRole})</span>
                              <span>·</span>
                              <span>{file.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.fileData && (
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(file)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
                              title="Download file directly to your desktop"
                            >
                              <Download size={15} />
                              <span>Download to Desktop</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteTaskFile(activeAdminTask.id, file.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeAdminTask.attachments && activeAdminTask.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {activeAdminTask.attachments.map((fileName, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                          <Paperclip size={16} className="text-[#168BFF]" />
                          <span>{fileName}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Attachment</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-400">
                    No files or deliverables uploaded by employee yet.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAdminTaskId(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Close Portal Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
