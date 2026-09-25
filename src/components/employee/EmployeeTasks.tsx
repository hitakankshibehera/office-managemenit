import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  MessageSquare,
  Send,
  X,
  ShieldAlert,
  ChevronRight,
  Filter,
  Upload,
  Download,
  FileText,
  FolderPlus,
  FileType,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskFileAttachment } from '../../types';

export const EmployeeTasks: React.FC = () => {
  const {
    currentEmployee,
    userRole,
    tasks,
    updateTaskStatus,
    toggleSubtask,
    selectedTaskId,
    setSelectedTaskId,
    uploadTaskFile,
    deleteTaskFile,
    submitTaskWork,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'ALL' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED'>('ALL');
  const [newComment, setNewComment] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);
  const [detailTab, setDetailTab] = useState<'details' | 'comments' | 'files'>('details');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedFiles || selectedFiles.length === 0 || !activeTask) return;

    setIsUploading(true);
    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadTaskFile(activeTask.id, selectedFiles[i]);
    }
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitWork = () => {
    if (!activeTask) return;

    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#168BFF', '#18BFFF', '#16C784', '#071A2F'],
    });

    submitTaskWork(activeTask.id, submissionNote.trim());
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 6000);
  };

  // Strict Security Isolation: Filter strictly by currentEmployee.id
  const myTasks = tasks.filter((t) => t.assignedToId === currentEmployee?.id);

  // Tab counts
  const countAll = myTasks.length;
  const countInProgress = myTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const countPending = myTasks.filter((t) => t.status === 'NOT_STARTED' || t.status === 'ON_HOLD').length;
  const countCompleted = myTasks.filter((t) => t.status === 'COMPLETED').length;

  // Filtered list
  const filteredTasks = myTasks.filter((t) => {
    if (filterTab === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (filterTab === 'PENDING') return t.status === 'NOT_STARTED' || t.status === 'ON_HOLD';
    if (filterTab === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  // Selected task for modal / drawer
  const activeTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : null;

  // Authorization check for activeTask
  const isAuthorized = activeTask ? (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || activeTask.assignedToId === currentEmployee?.id) : true;

  const handleOpenTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setStatusDraft(task.status);
    setDetailTab('details');
  };

  const handleCloseTask = () => {
    setSelectedTaskId(null);
    setStatusDraft(null);
  };

  const handleSaveStatus = () => {
    if (!activeTask || !statusDraft) return;
    updateTaskStatus(activeTask.id, statusDraft);
    // feedback
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newComment.trim()) return;
    updateTaskStatus(activeTask.id, activeTask.status, activeTask.progress, newComment.trim());
    setNewComment('');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Urgent Priority</span>;
      case 'HIGH':
        return <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">High Priority</span>;
      case 'MEDIUM':
        return <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Medium</span>;
      default:
        return <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Completed</span>;
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
      {/* Header and Filter Tabs matching Screen 11 */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and complete your assigned deliverables and milestones.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({countAll})
          </button>
          <button
            onClick={() => setFilterTab('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'IN_PROGRESS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({countInProgress})
          </button>
          <button
            onClick={() => setFilterTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'PENDING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({countPending})
          </button>
          <button
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'COMPLETED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({countCompleted})
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <CheckSquare size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No tasks in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select another tab to inspect ongoing or finished work.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleOpenTask(task)}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-[#168BFF]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#168BFF]" />
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#168BFF] transition-colors truncate">
                      {task.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    {getPriorityBadge(task.priority)}
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Deadline: {task.deadline}</span>
                    </span>
                    <span>·</span>
                    <span className="text-slate-400">
                      Assigned by: <strong>{task.assignedByName}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress bar & status pill */}
                <div className="flex items-center gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="w-36 text-right">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-mono tabular-nums text-slate-900">{task.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#168BFF] to-[#18BFFF] rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-28 flex justify-end">
                    {getStatusBadge(task.status)}
                  </div>

                  <ChevronRight size={18} className="text-slate-300 group-hover:text-[#168BFF] transition-colors hidden sm:block" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Details Modal / Screen 12 */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Task Details
                  </span>
                  {getPriorityBadge(activeTask.priority)}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#071A2F]">
                  {activeTask.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>Assigned to: <strong>{activeTask.assignedToName}</strong> ({activeTask.assignedToCode})</span>
                  <span>·</span>
                  <span>Deadline: <strong>{activeTask.deadline}</strong></span>
                  <span>·</span>
                  <span>Department: <strong>{activeTask.department}</strong></span>
                </div>
              </div>

              <button
                onClick={handleCloseTask}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Strict Authorization Check */}
            {!isAuthorized ? (
              <div className="p-8 text-center bg-rose-50 text-rose-800">
                <ShieldAlert size={48} className="mx-auto text-rose-600 mb-3" />
                <h3 className="text-lg font-bold">403 Forbidden: Access Denied</h3>
                <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">
                  Security Violation: You are not authorized to view or edit tasks assigned to another employee.
                </p>
                <button
                  onClick={handleCloseTask}
                  className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Modal Navigation Tabs */}
                <div className="px-6 border-b border-slate-100 flex gap-6 text-xs font-bold">
                  <button
                    onClick={() => setDetailTab('details')}
                    className={`py-3 border-b-2 transition-colors ${
                      detailTab === 'details'
                        ? 'border-[#168BFF] text-[#168BFF]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Details & Subtasks
                  </button>
                  <button
                    onClick={() => setDetailTab('comments')}
                    className={`py-3 border-b-2 transition-colors ${
                      detailTab === 'comments'
                        ? 'border-[#168BFF] text-[#168BFF]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Comments ({activeTask.comments.length})
                  </button>
                  <button
                    onClick={() => setDetailTab('files')}
                    className={`py-3 border-b-2 transition-colors ${
                      detailTab === 'files'
                        ? 'border-[#168BFF] text-[#168BFF]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Files & Attachments ({activeTask.attachments?.length || 0})
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {detailTab === 'details' && (
                    <>
                      {/* Description Card */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {activeTask.description}
                        </p>
                      </div>

                      {/* Subtasks Checklist */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Subtasks ({activeTask.subtasks.filter((s) => s.completed).length} / {activeTask.subtasks.length} Completed)
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#168BFF]">
                            {activeTask.progress}% Complete
                          </span>
                        </div>

                        <div className="space-y-2">
                          {activeTask.subtasks.map((subtask) => (
                            <label
                              key={subtask.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                subtask.completed
                                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(activeTask.id, subtask.id)}
                                className="w-4 h-4 rounded text-[#168BFF] focus:ring-[#168BFF]"
                              />
                              <span
                                className={`text-sm ${
                                  subtask.completed ? 'line-through text-slate-400' : 'font-medium'
                                }`}
                              >
                                {subtask.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {detailTab === 'comments' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {activeTask.comments.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400">
                            No comments yet. Post an update or ask a question below.
                          </div>
                        ) : (
                          activeTask.comments.map((comm) => (
                            <div key={comm.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-slate-900">{comm.authorName}</span>
                                <span className="text-slate-400 text-[11px]">{comm.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-normal">{comm.content}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment form */}
                      <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a message or update..."
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-[#168BFF] text-white hover:bg-[#1270cc] transition-colors"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {detailTab === 'files' && (
                    <div className="space-y-5">
                      {/* Desktop File Upload Area */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-2 border-dashed border-[#168BFF]/40 text-center">
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          id="task-file-upload-input"
                        />
                        <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center mx-auto mb-3 text-[#168BFF] shadow-xs">
                          <Upload size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-[#071A2F]">
                          Upload Deliverables from Desktop
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                          Select PDFs, documents, images, zip archives, or folders from your computer to submit with this task.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                          <label
                            htmlFor="task-file-upload-input"
                            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <FileText size={15} />
                            <span>{isUploading ? 'Uploading File...' : 'Choose Files / PDF'}</span>
                          </label>
                          <label
                            htmlFor="task-file-upload-input"
                            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <FolderPlus size={15} className="text-amber-500" />
                            <span>Upload Archive / Folder</span>
                          </label>
                        </div>
                      </div>

                      {/* Attachments List */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                          <span>Uploaded Work &amp; Files ({activeTask.fileAttachments?.length || activeTask.attachments?.length || 0})</span>
                          <span className="text-[11px] text-slate-400 font-normal">Available for HR / MD Download</span>
                        </h4>

                        {activeTask.fileAttachments && activeTask.fileAttachments.length > 0 ? (
                          <div className="space-y-2.5">
                            {activeTask.fileAttachments.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-200 hover:shadow-xs transition-all"
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
                                      <span>Uploaded by <strong>{file.uploadedBy}</strong></span>
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
                                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#168BFF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                      title="Download to Desktop"
                                    >
                                      <Download size={14} />
                                      <span>Download</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => deleteTaskFile(activeTask.id, file.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete file"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : activeTask.attachments && activeTask.attachments.length > 0 ? (
                          <div className="space-y-2">
                            {activeTask.attachments.map((fileName, i) => (
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
                          <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-400">
                            No files attached yet. Click the upload button above to submit PDFs, files, or folders.
                          </div>
                        )}
                      </div>

                      {/* Final Work Submission Section */}
                      <div className="p-5 rounded-2xl bg-[#071A2F] text-white space-y-3 shadow-md border border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#18BFFF] uppercase tracking-wider">
                          <Sparkles size={16} />
                          <span>Final Work Submission</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Once you have uploaded all your PDFs, documents, or compressed folders, click submit to complete your work for official HR / MD review.
                        </p>

                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={submissionNote}
                            onChange={(e) => setSubmissionNote(e.target.value)}
                            placeholder="Add submission notes for HR / MD (optional)..."
                            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40"
                          />
                          <button
                            type="button"
                            onClick={handleSubmitWork}
                            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 size={16} />
                            <span>SUBMIT COMPLETED WORK FOR HR / MD REVIEW</span>
                          </button>
                        </div>

                        {submissionSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 animate-in zoom-in-95">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>🎉 Work Successfully Submitted! HR / MD has been notified to inspect and download your files.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600">Update Status:</span>
                    <select
                      value={statusDraft || activeTask.status}
                      onChange={(e) => setStatusDraft(e.target.value as TaskStatus)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF]"
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCloseTask}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveStatus}
                      className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md hover:shadow-cyan-500/20 transition-all hover:scale-101"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
