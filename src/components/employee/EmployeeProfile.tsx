import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  MapPin,
  ShieldCheck,
  Edit3,
  Camera,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployeeProfile: React.FC = () => {
  const { currentEmployee, updateProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: currentEmployee?.phone || '',
    address: currentEmployee?.address || '',
    emergencyContact: currentEmployee?.emergencyContact || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your verified employee credentials and personnel records.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              phone: currentEmployee?.phone || '',
              address: currentEmployee?.address || '',
              emergencyContact: currentEmployee?.emergencyContact || '',
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#168BFF] text-white hover:bg-[#1270cc] transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Grid matching Screen 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Designation Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#168BFF]/20 shadow-md">
              <img
                src={
                  currentEmployee?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={currentEmployee?.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => alert('Photo updated with official company badge.')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#168BFF] text-white hover:bg-[#1270cc] shadow-md transition-colors"
              title="Change Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-[#071A2F]">
            {currentEmployee?.fullName || 'Rahul Kumar'}
          </h2>
          <span className="text-xs font-mono font-bold text-[#168BFF] mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
            {currentEmployee?.employeeCode || 'EMP-001'}
          </span>

          <p className="text-sm font-semibold text-slate-700 mt-3">
            {currentEmployee?.designation || 'Software Developer'}
          </p>
          <p className="text-xs text-slate-400">
            {currentEmployee?.departmentName || 'Development'} Department
          </p>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Account Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={14} /> Active & Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Shift Model:</span>
              <span className="font-semibold text-slate-800">Hybrid / Full-Time</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Contact & Personnel Info (8 cols matching Screen 8) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <h3 className="text-base font-bold text-[#071A2F] mb-6 pb-3 border-b border-slate-100">
            Employee Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Mail size={14} className="text-[#168BFF]" />
                Official Company Email
              </span>
              <span className="text-sm font-bold text-slate-900 truncate block">
                {currentEmployee?.email}
              </span>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Phone size={14} className="text-[#168BFF]" />
                Phone Number
              </span>
              <span className="text-sm font-bold text-slate-900 block font-mono">
                {currentEmployee?.phone}
              </span>
            </div>

            {/* Joining Date */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-[#168BFF]" />
                Joining Date
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {currentEmployee?.joiningDate || '12 Jan 2024'}
              </span>
            </div>

            {/* Department */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Building2 size={14} className="text-[#168BFF]" />
                Department
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {currentEmployee?.departmentName}
              </span>
            </div>

            {/* Designation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Briefcase size={14} className="text-[#168BFF]" />
                Designation
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {currentEmployee?.designation}
              </span>
            </div>

            {/* Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <MapPin size={14} className="text-[#168BFF]" />
                Residential Address
              </span>
              <span className="text-sm font-bold text-slate-900 block truncate">
                {currentEmployee?.address || 'Mumbai, Maharashtra'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 flex items-center justify-between">
            <span>
              Emergency Contact:{' '}
              <strong className="text-slate-800 font-mono">
                {currentEmployee?.emergencyContact || '+91 98200 11223'}
              </strong>
            </span>
            <span className="text-[11px] text-[#168BFF] font-semibold">
              Verified with HR Records
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Edit Profile Details</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#168BFF] text-white hover:bg-[#1270cc]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
