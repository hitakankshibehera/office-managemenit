import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Plus,
  Search,
  UserPlus,
  UserMinus,
  Trash2,
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ShieldAlert,
  Info,
  Building2,
  Sparkles,
  Calendar,
  Lock,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployeeGroup, GroupMessageAttachment, EmployeeProfile } from '../../types';

export const EmployeeGroupsView: React.FC = () => {
  const {
    userRole,
    currentUser,
    currentEmployee,
    employees,
    groups,
    createGroup,
    updateGroupMembers,
    addEmployeeToGroup,
    removeEmployeeFromGroup,
    deleteGroup,
    sendGroupMessage,
  } = useApp();

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  // Strict filtering: Employees only see groups where they are in group.memberIds
  const accessibleGroups = groups.filter((g) => {
    if (isAdmin) return true;
    if (!currentEmployee) return false;
    return g.memberIds.includes(currentEmployee.id);
  });

  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    accessibleGroups.length > 0 ? accessibleGroups[0].id : null
  );

  // Update active group if active group is deleted or unavailable
  useEffect(() => {
    if (accessibleGroups.length > 0) {
      if (!activeGroupId || !accessibleGroups.some((g) => g.id === activeGroupId)) {
        setActiveGroupId(accessibleGroups[0].id);
      }
    } else {
      setActiveGroupId(null);
    }
  }, [accessibleGroups, activeGroupId]);

  const activeGroup = accessibleGroups.find((g) => g.id === activeGroupId) || null;

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Expedition Operations');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [empSearchTerm, setEmpSearchTerm] = useState('');

  // Chat Input State
  const [messageInput, setMessageInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<GroupMessageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new message comes in
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeGroup?.messages]);

  // Categories list
  const categories = [
    'Expedition Operations',
    'Customer Delight & Sales',
    'High Altitude Logistics',
    'Engineering & Tech',
    'Emergency & Safety',
    'General',
  ];

  // Filter signed-up employees for admin picker
  const filteredSignedUpEmployees = employees.filter((emp) => {
    const query = empSearchTerm.toLowerCase();
    return (
      emp.fullName.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.employeeCode.toLowerCase().includes(query) ||
      emp.departmentName.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query)
    );
  });

  // Toggle selection of employee for new group
  const toggleEmployeeSelection = (empId: string) => {
    if (selectedMemberIds.includes(empId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== empId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, empId]);
    }
  };

  // Handle group creation
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    if (selectedMemberIds.length === 0) {
      alert('Please select at least one signed-up employee to create this group!');
      return;
    }

    const res = createGroup({
      name: newGroupName.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim(),
      memberIds: selectedMemberIds,
    });

    if (res.success && res.group) {
      setActiveGroupId(res.group.id);
      setNewGroupName('');
      setNewGroupDescription('');
      setSelectedMemberIds([]);
      setIsCreateModalOpen(false);
    }
  };

  // Manage members in active group
  const [manageEmpSearch, setManageEmpSearch] = useState('');
  const handleToggleMemberInActiveGroup = (empId: string) => {
    if (!activeGroup) return;
    if (activeGroup.memberIds.includes(empId)) {
      removeEmployeeFromGroup(activeGroup.id, empId);
    } else {
      addEmployeeToGroup(activeGroup.id, empId);
    }
  };

  // Desktop File Upload Handler for Group Chat
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as string;
        let fileType: GroupMessageAttachment['type'] = 'DOCUMENT';

        if (file.type.includes('pdf')) fileType = 'PDF';
        else if (file.type.includes('image')) fileType = 'IMAGE';
        else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar'))
          fileType = 'ARCHIVE';
        else if (file.name.includes('.') === false) fileType = 'FOLDER';

        const sizeInKB = Math.round(file.size / 1024);
        const formattedSize =
          sizeInKB > 1024
            ? `${(sizeInKB / 1024).toFixed(1)} MB`
            : `${sizeInKB} KB`;

        const newAttachment: GroupMessageAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          formattedSize,
          type: fileType,
          fileData,
          uploadedBy: currentEmployee?.fullName || 'User',
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setAttachedFiles((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (attId: string) => {
    setAttachedFiles(attachedFiles.filter((a) => a.id !== attId));
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup) return;
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    sendGroupMessage(activeGroup.id, messageInput.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
    setMessageInput('');
    setAttachedFiles([]);
  };

  // Download attachment helper
  const handleDownloadAttachment = (att: GroupMessageAttachment) => {
    if (!att.fileData) return;
    const link = document.createElement('a');
    link.href = att.fileData;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter groups
  const filteredGroups = accessibleGroups.filter((grp) => {
    const matchesSearch =
      grp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || grp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071A2F] via-[#0D2B4D] to-[#071A2F] rounded-2xl p-6 text-white shadow-xl border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#18BFFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 text-[#18BFFF] text-sm font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Team Collaboration Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAdmin ? 'HR / MD Employee Group Management' : 'My Assigned Employee Groups'}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {isAdmin
              ? 'Select signed-up employees to create custom groups. Employees will exclusively see the groups they were added to by HR / MD.'
              : 'Communicate and share documents with team members in groups assigned to you by HR / MD.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedMemberIds([]);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#18BFFF] to-[#168BFF] hover:from-[#168BFF] hover:to-[#0066CC] text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Employee Group</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {isAdmin ? 'Total Workspace Groups' : 'My Assigned Groups'}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{accessibleGroups.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#168BFF] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Signed-Up Employees
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#18BFFF] flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Group Messages
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {accessibleGroups.reduce((acc, g) => acc + g.messages.length, 0)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Your Access Role
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {isAdmin ? 'HR / MD / Manager' : 'Group Member'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Container: Split View */}
      {accessibleGroups.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {isAdmin ? 'No Employee Groups Created Yet' : 'No Employee Groups Assigned'}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            {isAdmin
              ? 'Click the "Create Employee Group" button above to pick signed-up employees and form specialized collaboration groups.'
              : 'You have not been added to any employee groups yet. When HR / MD adds you to a group, it will appear right here!'}
          </p>
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#168BFF] text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:bg-[#0066CC] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Group</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Groups List Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            {/* Search & Category Filter Header */}
            <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search groups by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#168BFF]"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                    categoryFilter === 'ALL'
                      ? 'bg-[#071A2F] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({accessibleGroups.length})
                </button>
                {categories.map((cat) => {
                  const count = accessibleGroups.filter((g) => g.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                        categoryFilter === cat
                          ? 'bg-[#071A2F] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Groups Item List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredGroups.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No groups matching search filter.
                </div>
              ) : (
                filteredGroups.map((grp) => {
                  const isActive = grp.id === activeGroupId;
                  const lastMsg = grp.messages[grp.messages.length - 1];

                  return (
                    <div
                      key={grp.id}
                      onClick={() => setActiveGroupId(grp.id)}
                      className={`p-4 cursor-pointer transition-all duration-150 relative group ${
                        isActive
                          ? 'bg-blue-50/70 border-l-4 border-l-[#168BFF]'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#071A2F] to-[#168BFF] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {grp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900 text-sm truncate">
                                {grp.name}
                              </h4>
                            </div>
                            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium mt-0.5">
                              {grp.category}
                            </span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete group "${grp.name}"?`)) {
                                deleteGroup(grp.id);
                              }
                            }}
                            title="Delete Group"
                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-2">
                        {grp.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{grp.memberIds.length} Signed-Up Employee(s)</span>
                        </div>
                        {lastMsg && (
                          <span className="truncate max-w-[120px]">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Group Chat & Workspace */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            {activeGroup ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#071A2F] to-[#168BFF] text-white flex items-center justify-center font-extrabold text-base shadow-md">
                      {activeGroup.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base">{activeGroup.name}</h2>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-[#0066CC]">
                          {activeGroup.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {activeGroup.description || 'Employee Collaboration Group'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsViewMembersModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium shadow-xs"
                    >
                      <Users className="w-4 h-4 text-[#168BFF]" />
                      <span>{activeGroup.memberIds.length} Members</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setIsManageMembersModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071A2F] hover:bg-[#0D2B4D] text-white text-xs font-medium shadow-xs transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#18BFFF]" />
                        <span>Manage Enrolled Employees</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                  {/* Notice banner */}
                  <div className="p-3 bg-cyan-50/70 border border-cyan-100 rounded-xl text-xs text-[#0066CC] flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-[#168BFF]" />
                    <span>
                      Only employees added by the Admin to <strong>{activeGroup.name}</strong> can view and participate in this discussion.
                    </span>
                  </div>

                  {activeGroup.messages.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      No messages yet in this group. Start the conversation!
                    </div>
                  ) : (
                    activeGroup.messages.map((msg) => {
                      const isMe =
                        msg.senderId === currentEmployee?.id || msg.senderId === currentUser?.id;
                      const isMsgAdmin = msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPER_ADMIN';

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                          {/* Sender Avatar */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs ${
                              isMsgAdmin
                                ? 'bg-gradient-to-tr from-amber-500 to-orange-400'
                                : 'bg-gradient-to-tr from-[#071A2F] to-[#168BFF]'
                            }`}
                          >
                            {msg.senderAvatar ? (
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              msg.senderName.substring(0, 2).toUpperCase()
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[75%] rounded-2xl p-3 shadow-xs space-y-1 ${
                              isMe
                                ? 'bg-[#071A2F] text-white rounded-tr-none'
                                : isMsgAdmin
                                ? 'bg-slate-900 text-white rounded-tl-none border border-slate-800'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[11px]">
                              <span
                                className={`font-semibold ${
                                  isMe
                                    ? 'text-[#18BFFF]'
                                    : isMsgAdmin
                                    ? 'text-amber-400'
                                    : 'text-slate-900'
                                }`}
                              >
                                {msg.senderName}
                              </span>
                              <div className="flex items-center gap-1.5 opacity-70 text-[10px]">
                                {isMsgAdmin && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                    ADMIN
                                  </span>
                                )}
                                <span>
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </p>

                            {/* Attachments List */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="pt-2 space-y-1.5 border-t border-slate-700/30">
                                {msg.attachments.map((att) => (
                                  <div
                                    key={att.id}
                                    onClick={() => handleDownloadAttachment(att)}
                                    className={`flex items-center justify-between gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                                      isMe || isMsgAdmin
                                        ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {att.type === 'PDF' ? (
                                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                                      ) : att.type === 'IMAGE' ? (
                                        <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                      )}
                                      <span className="truncate font-medium">{att.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-[10px] opacity-70">{att.formattedSize}</span>
                                      <Download className="w-3.5 h-3.5 text-[#18BFFF]" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Attached File Previews Bar */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                    <span className="text-xs font-semibold text-slate-600 shrink-0">
                      Attachments ({attachedFiles.length}):
                    </span>
                    {attachedFiles.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-xs shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#168BFF]" />
                        <span className="font-medium max-w-[120px] truncate">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(att.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach Files from Desktop (PDF, Docs, Images, Zip)"
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#168BFF] transition-colors cursor-pointer shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Write a message in ${activeGroup.name}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#168BFF]"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() && attachedFiles.length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#18BFFF] to-[#168BFF] hover:from-[#168BFF] hover:to-[#0066CC] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
                <p className="font-medium text-slate-600">Select a group to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Create Employee Group (Admin Only) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#071A2F]">
                <Users className="w-6 h-6 text-[#168BFF]" />
                <h3 className="text-xl font-bold">Create New Employee Group</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Expedition Guides & Ops"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#168BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Group Category
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#168BFF]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the focus and goals of this employee group..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#168BFF]"
                />
              </div>

              {/* Signed-Up Employee Selection Panel */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#168BFF]" />
                    <span>Select Signed-Up Employees to Add ({selectedMemberIds.length} Selected)</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedMemberIds(employees.map((e) => e.id))}
                      className="text-[#168BFF] font-semibold hover:underline"
                    >
                      Select All ({employees.length})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMemberIds([])}
                      className="text-slate-500 font-semibold hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search signed-up employees by name, email, code..."
                    value={empSearchTerm}
                    onChange={(e) => setEmpSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#18BFFF]/40"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                  {filteredSignedUpEmployees.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No signed-up employees found matching query.
                    </div>
                  ) : (
                    filteredSignedUpEmployees.map((emp) => {
                      const isSelected = selectedMemberIds.includes(emp.id);

                      return (
                        <div
                          key={emp.id}
                          onClick={() => toggleEmployeeSelection(emp.id)}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-cyan-50/80 border-l-4 border-l-[#168BFF]' : 'hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#168BFF] rounded-md focus:ring-[#18BFFF]"
                            />
                            <div className="w-8 h-8 rounded-full bg-[#071A2F] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {emp.profileImage ? (
                                <img
                                  src={emp.profileImage}
                                  alt={emp.fullName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                emp.fullName.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{emp.fullName}</p>
                              <p className="text-[11px] text-slate-500">
                                {emp.designation} • {emp.departmentName || 'General'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                              {emp.employeeCode}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedMemberIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#18BFFF] to-[#168BFF] hover:from-[#168BFF] hover:to-[#0066CC] disabled:opacity-50 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  Create Group & Notify Employees
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Group Members */}
      {isViewMembersModalOpen && activeGroup && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeGroup.name} - Enrolled Members</h3>
                <p className="text-xs text-slate-500">{activeGroup.memberIds.length} signed-up employee(s) in this group</p>
              </div>
              <button
                onClick={() => setIsViewMembersModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {activeGroup.memberIds.map((memId) => {
                const emp = employees.find((e) => e.id === memId);
                return (
                  <div key={memId} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#071A2F] text-white flex items-center justify-center font-bold text-xs">
                        {emp?.fullName ? emp.fullName.substring(0, 2).toUpperCase() : 'EM'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{emp?.fullName || 'Employee Member'}</p>
                        <p className="text-[11px] text-slate-500">{emp?.email || ''}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {emp?.employeeCode || 'MEM'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsViewMembersModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Manage Enrolled Employees (Admin Only) */}
      {isManageMembersModalOpen && activeGroup && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage Members for "{activeGroup.name}"</h3>
                <p className="text-xs text-slate-500">
                  Add or remove signed-up employees. Only selected employees can view this group.
                </p>
              </div>
              <button
                onClick={() => setIsManageMembersModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search signed-up employees..."
                value={manageEmpSearch}
                onChange={(e) => setManageEmpSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#18BFFF]/40"
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {employees
                .filter(
                  (e) =>
                    e.fullName.toLowerCase().includes(manageEmpSearch.toLowerCase()) ||
                    e.email.toLowerCase().includes(manageEmpSearch.toLowerCase()) ||
                    e.employeeCode.toLowerCase().includes(manageEmpSearch.toLowerCase())
                )
                .map((emp) => {
                  const isMember = activeGroup.memberIds.includes(emp.id);

                  return (
                    <div
                      key={emp.id}
                      className="p-3 flex items-center justify-between hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#071A2F] text-white flex items-center justify-center font-bold text-xs">
                          {emp.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{emp.fullName}</p>
                          <p className="text-[11px] text-slate-500">{emp.designation}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleMemberInActiveGroup(emp.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isMember
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            : 'bg-cyan-50 text-[#0066CC] border border-cyan-200 hover:bg-cyan-100'
                        }`}
                      >
                        {isMember ? (
                          <>
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Add to Group</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsManageMembersModalOpen(false)}
                className="px-5 py-2 bg-[#071A2F] text-white rounded-xl text-xs font-bold hover:bg-[#0D2B4D]"
              >
                Done Managing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
